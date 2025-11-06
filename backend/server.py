from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRE_MINUTES', 30))

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============= MODELS =============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    phone: Optional[str] = None
    auth_method: str = "email"  # email, google, apple
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[str] = None
    ssn_last4: Optional[str] = None
    address: Optional[Dict[str, str]] = None
    employment_status: Optional[str] = None
    employer_name: Optional[str] = None
    annual_income: Optional[float] = None
    monthly_income: Optional[float] = None
    assets: Optional[float] = None
    liabilities: Optional[float] = None
    credit_score: Optional[int] = None
    kyc_status: str = "incomplete"  # incomplete, pending, verified
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[str] = None
    ssn_last4: Optional[str] = None
    address: Optional[Dict[str, str]] = None
    employment_status: Optional[str] = None
    employer_name: Optional[str] = None
    annual_income: Optional[float] = None
    monthly_income: Optional[float] = None
    assets: Optional[float] = None
    liabilities: Optional[float] = None

class Document(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # passport, drivers_license, payslip, bank_statement, tax_return
    filename: str
    file_url: str
    ocr_status: str = "pending"  # pending, processing, completed, failed
    ocr_data: Optional[Dict[str, Any]] = None
    confidence_score: Optional[float] = None
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessage(BaseModel):
    role: str  # user, assistant
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    messages: List[ChatMessage] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    use_primary: bool = True  # True for Claude, False for GPT

class ChatResponse(BaseModel):
    message: str
    session_id: str
    intent: Optional[str] = None
    confidence: Optional[float] = None
    suggestions: Optional[List[str]] = None

class PreQualRequest(BaseModel):
    loan_amount: float
    down_payment: float
    annual_income: float
    monthly_debts: float
    credit_score: Optional[int] = None
    employment_status: str
    property_type: str = "primary"

class PreQualResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    loan_amount: float
    down_payment: float
    credit_score: Optional[int]
    dti: float
    status: str  # approved, conditional, denied
    max_loan_amount: Optional[float] = None
    estimated_rate: Optional[float] = None
    monthly_payment: Optional[float] = None
    conditions: List[str] = []
    explanation: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MortgageProduct(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lender_name: str
    loan_type: str  # fixed, variable, hybrid, interest_only
    rate: float
    apr: float
    term: int  # in months
    fees: float
    min_credit_score: int
    min_down_payment: float
    max_loan_amount: float
    features: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    loan_amount: float
    loan_type: str
    property_address: Dict[str, str]
    property_value: float
    down_payment: float
    purpose: str  # purchase, refinance
    status: str = "draft"  # draft, submitted, under_review, approved, conditional, denied
    documents: List[str] = []
    co_borrower_id: Optional[str] = None
    submitted_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ApplicationCreate(BaseModel):
    loan_amount: float
    loan_type: str
    property_address: Dict[str, str]
    property_value: float
    down_payment: float
    purpose: str = "purchase"

# ============= HELPER FUNCTIONS =============

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user_doc is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user_doc)

async def get_ai_response(message: str, session_id: str, user_id: str, use_primary: bool = True) -> Dict[str, Any]:
    """Get AI response using Claude (primary) or GPT (secondary)"""
    try:
        # Initialize appropriate chat model
        if use_primary:
            # Claude Sonnet 4 for reasoning and explainability
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message="""You are an expert mortgage advisor AI assistant. Your role is to help users understand mortgages, 
                calculate pre-qualifications, explain loan types, and guide them through the application process. 
                
                Be clear, empathetic, and transparent. When making recommendations, always explain your reasoning.
                If you detect stress or confusion, adjust your tone to be more supportive.
                
                Available intents: getQuote, preQual, startApplication, uploadDoc, explainTerm, requestHuman.
                
                Always provide practical, actionable advice and be ready to explain complex financial concepts in simple terms."""
            ).with_model("anthropic", "claude-3-7-sonnet-20250219")
        else:
            # OpenAI GPT-5 for conversational interface
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message="""You are a friendly mortgage assistant helping users with their home loan journey. 
                Be conversational, warm, and helpful. Guide users through the mortgage process with clarity and empathy."""
            ).with_model("openai", "gpt-5")
        
        user_message = UserMessage(text=message)
        response = await chat.send_message(user_message)
        
        # Detect intent (simple keyword-based for MVP)
        intent = None
        message_lower = message.lower()
        if any(word in message_lower for word in ['quote', 'rate', 'payment', 'calculate']):
            intent = 'getQuote'
        elif any(word in message_lower for word in ['qualify', 'eligible', 'pre-qual', 'prequalify']):
            intent = 'preQual'
        elif any(word in message_lower for word in ['apply', 'application', 'start']):
            intent = 'startApplication'
        elif any(word in message_lower for word in ['upload', 'document', 'doc']):
            intent = 'uploadDoc'
        elif any(word in message_lower for word in ['explain', 'what is', 'what are', 'help me understand']):
            intent = 'explainTerm'
        elif any(word in message_lower for word in ['talk', 'human', 'person', 'agent']):
            intent = 'requestHuman'
        
        return {
            "response": response,
            "intent": intent,
            "model": "claude-sonnet-4" if use_primary else "gpt-5"
        }
    except Exception as e:
        logging.error(f"AI response error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

def calculate_prequal(data: PreQualRequest, credit_score: Optional[int] = None) -> Dict[str, Any]:
    """Calculate pre-qualification based on user inputs"""
    # Use provided credit score or estimate from profile
    score = credit_score or data.credit_score or 680  # Default mid-range
    
    # Calculate DTI (Debt-to-Income ratio)
    monthly_income = data.annual_income / 12
    dti = (data.monthly_debts / monthly_income) * 100 if monthly_income > 0 else 100
    
    # Calculate LTV (Loan-to-Value)
    property_value = data.loan_amount + data.down_payment
    ltv = (data.loan_amount / property_value * 100) if property_value > 0 else 100
    
    # Determine approval status
    conditions = []
    status = "approved"
    
    if score < 620:
        status = "denied"
        conditions.append("Credit score below minimum requirement (620)")
    elif score < 680:
        status = "conditional"
        conditions.append("Credit score requires additional documentation")
    
    if dti > 43:
        if status == "approved":
            status = "conditional"
        conditions.append("Debt-to-income ratio exceeds 43% - may require compensating factors")
    
    if ltv > 97:
        if status == "approved":
            status = "conditional"
        conditions.append("High loan-to-value ratio - may require PMI or larger down payment")
    
    if data.employment_status not in ['employed', 'self-employed']:
        if status == "approved":
            status = "conditional"
        conditions.append("Employment verification required")
    
    # Estimate rate based on credit score and LTV
    base_rate = 6.5
    if score >= 760:
        base_rate = 5.75
    elif score >= 700:
        base_rate = 6.0
    elif score >= 680:
        base_rate = 6.25
    
    if ltv > 80:
        base_rate += 0.25
    if ltv > 90:
        base_rate += 0.25
    
    # Calculate monthly payment (using simple formula)
    monthly_rate = base_rate / 100 / 12
    num_payments = 360  # 30-year loan
    if monthly_rate > 0:
        monthly_payment = data.loan_amount * (monthly_rate * (1 + monthly_rate) ** num_payments) / ((1 + monthly_rate) ** num_payments - 1)
    else:
        monthly_payment = data.loan_amount / num_payments
    
    # Calculate max loan amount based on DTI
    max_monthly_payment = (monthly_income * 0.43) - data.monthly_debts
    if monthly_rate > 0 and max_monthly_payment > 0:
        max_loan = max_monthly_payment * ((1 + monthly_rate) ** num_payments - 1) / (monthly_rate * (1 + monthly_rate) ** num_payments)
    else:
        max_loan = data.loan_amount
    
    explanation = f"""Based on your financial profile:
- Credit Score: {score}
- Debt-to-Income Ratio: {dti:.1f}%
- Loan-to-Value Ratio: {ltv:.1f}%
- Employment Status: {data.employment_status}

You are {status} for a mortgage of ${data.loan_amount:,.2f}."""
    
    if conditions:
        explanation += "\n\nConditions: " + ", ".join(conditions)
    
    return {
        "status": status,
        "dti": round(dti, 2),
        "ltv": round(ltv, 2),
        "estimated_rate": round(base_rate, 3),
        "monthly_payment": round(monthly_payment, 2),
        "max_loan_amount": round(max_loan, 2),
        "conditions": conditions,
        "explanation": explanation
    }

# ============= ROUTES =============

@api_router.get("/")
async def root():
    return {"message": "Mortgage Platform API", "version": "1.0.0"}

# Auth Routes
@api_router.post("/auth/signup", response_model=Token)
async def signup(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_pwd = hash_password(user_data.password)
    user = User(email=user_data.email, phone=user_data.phone)
    user_dict = user.model_dump()
    user_dict['password_hash'] = hashed_pwd
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['updated_at'] = user_dict['updated_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create empty profile
    profile = UserProfile(user_id=user.id)
    profile_dict = profile.model_dump()
    profile_dict['created_at'] = profile_dict['created_at'].isoformat()
    profile_dict['updated_at'] = profile_dict['updated_at'].isoformat()
    await db.user_profiles.insert_one(profile_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc or not verify_password(credentials.password, user_doc.get('password_hash', '')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user = User(**{k: v for k, v in user_doc.items() if k != 'password_hash'})
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Profile Routes
@api_router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    profile_doc = await db.user_profiles.find_one({"user_id": current_user.id}, {"_id": 0})
    if not profile_doc:
        # Create empty profile if doesn't exist
        profile = UserProfile(user_id=current_user.id)
        profile_dict = profile.model_dump()
        profile_dict['created_at'] = profile_dict['created_at'].isoformat()
        profile_dict['updated_at'] = profile_dict['updated_at'].isoformat()
        await db.user_profiles.insert_one(profile_dict)
        return profile
    return profile_doc

@api_router.put("/profile")
async def update_profile(profile_update: ProfileUpdate, current_user: User = Depends(get_current_user)):
    update_data = {k: v for k, v in profile_update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Update KYC status based on completeness
    profile_doc = await db.user_profiles.find_one({"user_id": current_user.id})
    if profile_doc:
        required_fields = ['first_name', 'last_name', 'dob', 'address', 'employment_status', 'annual_income']
        completed = all(profile_doc.get(field) or update_data.get(field) for field in required_fields)
        if completed:
            update_data['kyc_status'] = 'pending'
    
    await db.user_profiles.update_one(
        {"user_id": current_user.id},
        {"$set": update_data}
    )
    
    updated_profile = await db.user_profiles.find_one({"user_id": current_user.id}, {"_id": 0})
    return updated_profile

# Document Routes
@api_router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    doc_type: str = "other",
    current_user: User = Depends(get_current_user)
):
    # Mock file storage (in production, upload to S3)
    file_url = f"/storage/{current_user.id}/{file.filename}"
    
    # Mock OCR processing
    ocr_data = {
        "filename": file.filename,
        "extracted_text": "[Mock OCR] Document processed successfully",
        "fields": {
            "name": "John Doe",
            "date": "2025-01-15",
            "amount": "$5,000"
        }
    }
    
    document = Document(
        user_id=current_user.id,
        type=doc_type,
        filename=file.filename,
        file_url=file_url,
        ocr_status="completed",
        ocr_data=ocr_data,
        confidence_score=0.95
    )
    
    doc_dict = document.model_dump()
    doc_dict['uploaded_at'] = doc_dict['uploaded_at'].isoformat()
    await db.documents.insert_one(doc_dict)
    
    return document

@api_router.get("/documents")
async def get_documents(current_user: User = Depends(get_current_user)):
    documents = await db.documents.find({"user_id": current_user.id}, {"_id": 0}).to_list(100)
    return documents

# Chat Routes
@api_router.post("/chat/message", response_model=ChatResponse)
async def send_chat_message(chat_req: ChatRequest, current_user: User = Depends(get_current_user)):
    session_id = chat_req.session_id or str(uuid.uuid4())
    
    # Get or create chat session
    session_doc = await db.chat_sessions.find_one({"session_id": session_id, "user_id": current_user.id}, {"_id": 0})
    
    if not session_doc:
        session = ChatSession(user_id=current_user.id, session_id=session_id)
        session_dict = session.model_dump()
        session_dict['created_at'] = session_dict['created_at'].isoformat()
        session_dict['updated_at'] = session_dict['updated_at'].isoformat()
        await db.chat_sessions.insert_one(session_dict)
    
    # Get AI response
    ai_result = await get_ai_response(chat_req.message, session_id, current_user.id, chat_req.use_primary)
    
    # Save messages
    user_msg = ChatMessage(role="user", content=chat_req.message)
    assistant_msg = ChatMessage(role="assistant", content=ai_result["response"])
    
    await db.chat_sessions.update_one(
        {"session_id": session_id},
        {
            "$push": {
                "messages": {
                    "$each": [
                        {**user_msg.model_dump(), "timestamp": user_msg.timestamp.isoformat()},
                        {**assistant_msg.model_dump(), "timestamp": assistant_msg.timestamp.isoformat()}
                    ]
                }
            },
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    # Generate suggestions based on intent
    suggestions = []
    if ai_result["intent"] == "getQuote":
        suggestions = ["Calculate pre-qualification", "View mortgage products", "Start application"]
    elif ai_result["intent"] == "preQual":
        suggestions = ["Start pre-qualification", "Upload documents", "Talk to an advisor"]
    
    return ChatResponse(
        message=ai_result["response"],
        session_id=session_id,
        intent=ai_result["intent"],
        suggestions=suggestions
    )

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str, current_user: User = Depends(get_current_user)):
    session = await db.chat_sessions.find_one({"session_id": session_id, "user_id": current_user.id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return session

# Pre-Qualification Routes
@api_router.post("/prequal/calculate", response_model=PreQualResult)
async def calculate_prequalification(prequal_data: PreQualRequest, current_user: User = Depends(get_current_user)):
    # Get user profile for credit score
    profile_doc = await db.user_profiles.find_one({"user_id": current_user.id})
    credit_score = profile_doc.get('credit_score') if profile_doc else None
    
    # Calculate pre-qualification
    result = calculate_prequal(prequal_data, credit_score)
    
    # Create PreQualResult
    prequal_result = PreQualResult(
        user_id=current_user.id,
        loan_amount=prequal_data.loan_amount,
        down_payment=prequal_data.down_payment,
        credit_score=credit_score or prequal_data.credit_score,
        dti=result['dti'],
        status=result['status'],
        max_loan_amount=result.get('max_loan_amount'),
        estimated_rate=result.get('estimated_rate'),
        monthly_payment=result.get('monthly_payment'),
        conditions=result.get('conditions', []),
        explanation=result.get('explanation')
    )
    
    # Save to database
    result_dict = prequal_result.model_dump()
    result_dict['created_at'] = result_dict['created_at'].isoformat()
    await db.prequal_results.insert_one(result_dict)
    
    return prequal_result

@api_router.get("/prequal/history")
async def get_prequal_history(current_user: User = Depends(get_current_user)):
    results = await db.prequal_results.find({"user_id": current_user.id}, {"_id": 0}).sort("created_at", -1).to_list(10)
    return results

# Product Routes
@api_router.get("/products")
async def get_products():
    # Mock products (in production, fetch from database)
    products = [
        {
            "id": str(uuid.uuid4()),
            "lender_name": "Prime Lending",
            "loan_type": "fixed",
            "rate": 5.75,
            "apr": 5.95,
            "term": 360,
            "fees": 2500,
            "min_credit_score": 700,
            "min_down_payment": 0.20,
            "max_loan_amount": 1000000,
            "features": ["No prepayment penalty", "Rate lock for 60 days", "Free appraisal"]
        },
        {
            "id": str(uuid.uuid4()),
            "lender_name": "Community Bank",
            "loan_type": "fixed",
            "rate": 6.00,
            "apr": 6.15,
            "term": 360,
            "fees": 1800,
            "min_credit_score": 680,
            "min_down_payment": 0.15,
            "max_loan_amount": 750000,
            "features": ["Low closing costs", "First-time buyer programs", "Flexible documentation"]
        },
        {
            "id": str(uuid.uuid4()),
            "lender_name": "Digital Mortgage Co",
            "loan_type": "variable",
            "rate": 5.25,
            "apr": 5.60,
            "term": 360,
            "fees": 2000,
            "min_credit_score": 720,
            "min_down_payment": 0.20,
            "max_loan_amount": 1500000,
            "features": ["Fully digital process", "Fast approval", "Mobile app included"]
        },
        {
            "id": str(uuid.uuid4()),
            "lender_name": "First Home Finance",
            "loan_type": "fixed",
            "rate": 6.25,
            "apr": 6.40,
            "term": 180,
            "fees": 1500,
            "min_credit_score": 660,
            "min_down_payment": 0.10,
            "max_loan_amount": 500000,
            "features": ["15-year term", "Lower total interest", "Faster equity building"]
        }
    ]
    return products

# Application Routes
@api_router.post("/applications", response_model=Application)
async def create_application(app_data: ApplicationCreate, current_user: User = Depends(get_current_user)):
    application = Application(
        user_id=current_user.id,
        loan_amount=app_data.loan_amount,
        loan_type=app_data.loan_type,
        property_address=app_data.property_address,
        property_value=app_data.property_value,
        down_payment=app_data.down_payment,
        purpose=app_data.purpose
    )
    
    app_dict = application.model_dump()
    app_dict['updated_at'] = app_dict['updated_at'].isoformat()
    await db.applications.insert_one(app_dict)
    
    return application

@api_router.get("/applications")
async def get_applications(current_user: User = Depends(get_current_user)):
    applications = await db.applications.find({"user_id": current_user.id}, {"_id": 0}).sort("updated_at", -1).to_list(50)
    return applications

@api_router.get("/applications/{application_id}")
async def get_application(application_id: str, current_user: User = Depends(get_current_user)):
    application = await db.applications.find_one({"id": application_id, "user_id": current_user.id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@api_router.put("/applications/{application_id}/submit")
async def submit_application(application_id: str, current_user: User = Depends(get_current_user)):
    result = await db.applications.update_one(
        {"id": application_id, "user_id": current_user.id},
        {
            "$set": {
                "status": "submitted",
                "submitted_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    return application

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()