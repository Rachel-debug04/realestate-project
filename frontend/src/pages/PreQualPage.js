import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { prequalAPI } from '@/lib/api';
import { toast } from 'sonner';
import { formatCurrency, calculateMonthlyPayment } from '@/lib/utils';
import { TrendingUp, DollarSign, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function PreQualPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    loan_amount: 300000,
    down_payment: 60000,
    annual_income: 80000,
    monthly_debts: 1500,
    credit_score: 700,
    employment_status: 'employed',
    property_type: 'primary'
  });

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultData = await prequalAPI.calculate(formData);
      setResult(resultData);
      toast.success('Pre-qualification calculated!');
    } catch (error) {
      console.error('Pre-qual calculation failed:', error);
      toast.error('Failed to calculate pre-qualification');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!result) return null;
    switch (result.status) {
      case 'approved':
        return <CheckCircle className="h-12 w-12 text-[#10B981]" />;
      case 'conditional':
        return <AlertCircle className="h-12 w-12 text-[#F59E0B]" />;
      case 'denied':
        return <XCircle className="h-12 w-12 text-[#EF4444]" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    if (!result) return '';
    switch (result.status) {
      case 'approved':
        return 'bg-[#10B981]';
      case 'conditional':
        return 'bg-[#F59E0B]';
      case 'denied':
        return 'bg-[#EF4444]';
      default:
        return 'bg-[#667085]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-4" style={{ fontFamily: 'Space Grotesk' }} data-testid="prequal-title">
            Pre-Qualification
          </h1>
          <p className="text-lg text-[#667085]">
            Get instant pre-qualification results based on your financial profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-[#E5E7EB]">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk' }}>Your Financial Information</CardTitle>
                <CardDescription>Adjust the values to see your pre-qualification</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCalculate} className="space-y-8" data-testid="prequal-form">
                  <div>
                    <Label>Loan Amount: {formatCurrency(formData.loan_amount)}</Label>
                    <Slider value={[formData.loan_amount]} onValueChange={([value]) => setFormData({...formData, loan_amount: value})} min={50000} max={1000000} step={10000} className="mt-4" data-testid="loan-amount-slider" />
                  </div>

                  <div>
                    <Label>Down Payment: {formatCurrency(formData.down_payment)}</Label>
                    <Slider value={[formData.down_payment]} onValueChange={([value]) => setFormData({...formData, down_payment: value})} min={0} max={200000} step={5000} className="mt-4" data-testid="down-payment-slider" />
                  </div>

                  <div>
                    <Label>Annual Income: {formatCurrency(formData.annual_income)}</Label>
                    <Slider value={[formData.annual_income]} onValueChange={([value]) => setFormData({...formData, annual_income: value})} min={20000} max={300000} step={5000} className="mt-4" data-testid="income-slider" />
                  </div>

                  <div>
                    <Label>Monthly Debts: {formatCurrency(formData.monthly_debts)}</Label>
                    <Slider value={[formData.monthly_debts]} onValueChange={([value]) => setFormData({...formData, monthly_debts: value})} min={0} max={5000} step={100} className="mt-4" data-testid="debts-slider" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="credit_score">Credit Score (Optional)</Label>
                      <Input id="credit_score" type="number" value={formData.credit_score} onChange={(e) => setFormData({...formData, credit_score: parseInt(e.target.value) || 0})} min="300" max="850" className="mt-2" data-testid="credit-score" />
                    </div>
                    <div>
                      <Label htmlFor="employment_status">Employment Status</Label>
                      <Select value={formData.employment_status} onValueChange={(value) => setFormData({...formData, employment_status: value})}>
                        <SelectTrigger className="mt-2" data-testid="employment-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-12 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full text-lg" data-testid="calculate-prequal">
                    {loading ? 'Calculating...' : 'Calculate Pre-Qualification'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            {result ? (
              <Card className={`border-[#E5E7EB] ${result.status === 'approved' ? 'ring-2 ring-[#10B981]' : ''}`} data-testid="prequal-result">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle style={{ fontFamily: 'Space Grotesk' }}>Result</CardTitle>
                    {getStatusIcon()}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <span className={`inline-block px-6 py-2 rounded-full text-white font-semibold text-lg capitalize ${getStatusColor()}`}>
                      {result.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Estimated Rate</span>
                      <span className="font-semibold">{result.estimated_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Monthly Payment</span>
                      <span className="font-semibold">{formatCurrency(result.monthly_payment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">DTI Ratio</span>
                      <span className="font-semibold">{result.dti}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Max Loan Amount</span>
                      <span className="font-semibold">{formatCurrency(result.max_loan_amount)}</span>
                    </div>
                  </div>

                  {result.explanation && (
                    <div className="border-t border-[#E5E7EB] pt-4">
                      <p className="text-sm text-[#667085] whitespace-pre-wrap">{result.explanation}</p>
                    </div>
                  )}

                  {result.conditions && result.conditions.length > 0 && (
                    <div className="border-t border-[#E5E7EB] pt-4">
                      <p className="text-sm font-medium mb-2">Conditions:</p>
                      <ul className="space-y-1">
                        {result.conditions.map((cond, idx) => (
                          <li key={idx} className="text-sm text-[#667085] flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                            {cond}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.status === 'approved' && (
                    <Button onClick={() => navigate('/application')} className="w-full bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full" data-testid="start-application">
                      Start Application
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-[#E5E7EB]">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Space Grotesk' }}>Quick Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 text-[#A9CCE3] mx-auto mb-4" />
                    <p className="text-[#667085]">Fill out the form to see your pre-qualification estimate</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}