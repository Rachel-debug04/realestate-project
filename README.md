# EasyMortgage - Lemonade-Inspired Mortgage Platform MVP

## Overview

EasyMortgage is a production-grade, AI-powered mortgage platform that makes mortgage discovery, pre-qualification, application, and lifecycle management fast, transparent, and emotionally intelligent. Built with modern fintech security and compliance standards.

## 🎯 MVP Features Delivered

### Borrower Journey (Phase 1)
- ✅ **Authentication & Onboarding**
  - Email/password signup and login
  - JWT-based secure authentication
  - Progressive profile completion
  
- ✅ **AI Mortgage Advisor**
  - Powered by Claude Sonnet 4 (primary) for reasoning/explainability
  - OpenAI GPT-5 (secondary) for conversational interface
  - Real-time NLU chat with intent detection (getQuote, preQual, startApplication, uploadDoc, explainTerm, requestHuman)
  - Contextual suggestions and follow-up actions
  - Persistent chat history
  
- ✅ **Profile & KYC**
  - Progressive disclosure profile form
  - Document upload with mock OCR processing
  - KYC status tracking (incomplete, pending, verified)
  - Employment and financial information capture
  
- ✅ **Product Discovery**
  - Browse mortgage products from multiple lenders
  - Filter by loan type (fixed, variable, hybrid)
  - Side-by-side comparison (up to 3 products)
  - Detailed product features, rates, APR, terms, fees
  
- ✅ **Pre-Qualification**
  - Instant pre-qual calculations
  - Interactive sliders for loan amount, down payment, income, debts
  - Real-time DTI and LTV calculations
  - Credit score-based rate estimation
  - Approval status with detailed explanation
  - Conditional approvals with specific requirements
  
- ✅ **Application Management**
  - Multi-step application wizard
  - Property details and loan information
  - Save/resume functionality
  - Application status tracking
  - Document attachment support

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 19 + React Router v7
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: Sonner
- **Typography**: Space Grotesk (headings), Inter (body)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT with bcrypt password hashing
- **AI Integration**: Emergent LLM Key (universal key for Claude & GPT)
  - emergentintegrations library
  - Claude Sonnet 4 (claude-3-7-sonnet-20250219)
  - OpenAI GPT-5
- **Security**: Passlib, python-jose

## 🎨 Design System

### Color Palette
- **Primary**: #0F4C81 (Cool Blue)
- **Secondary**: #2A6F9E
- **Light**: #A9CCE3
- **Background**: #FFFFFF, #F8F9FA
- **Foreground**: #0A1929

### Typography
- **Headings**: Space Grotesk, 600 weight
- **Body**: Inter, 400-600 weight

## 🚀 Access Application

**Live URL**: https://easymortgage-1.preview.emergentagent.com

### Test Credentials
```
Email: testuser@example.com
Password: Password123!
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### AI Chat
- `POST /api/chat/message` - Send message to AI advisor
- `GET /api/chat/history/{session_id}` - Get chat history

### Pre-Qualification
- `POST /api/prequal/calculate` - Calculate pre-qualification

### Products
- `GET /api/products` - Get all mortgage products

### Applications
- `POST /api/applications` - Create new application
- `GET /api/applications` - Get user applications

## 🎯 MVP Status

### ✅ Completed
- [x] Modern fintech landing page
- [x] JWT authentication (signup/login)
- [x] AI Mortgage Advisor (Claude + GPT)
- [x] Profile management
- [x] Pre-qualification calculator
- [x] Product discovery
- [x] Application workflow
- [x] Responsive design

### 🔄 Mocked for MVP
- Document OCR (returns mock data)
- Credit bureau (manual input)
- Payment processing
- KYC verification

### 📋 Phase 2 (Planned)
- Lender/Broker portal
- Admin console
- Real underwriting ML
- Fraud detection
- E-signature
- Real credit bureau API

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Protected API routes
- Input validation
- CORS configuration

## 📝 Development

```bash
# Backend
cd /app/backend
sudo supervisorctl restart backend

# Frontend
cd /app/frontend
sudo supervisorctl restart frontend
```

---

**Version**: 1.0.0 MVP  
**Status**: ✅ Complete  
**Built with**: Emergent AI Platform
