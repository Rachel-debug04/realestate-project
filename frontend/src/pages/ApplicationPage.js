import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { applicationsAPI } from '@/lib/api';
import { toast } from 'sonner';
import { FileText, CheckCircle } from 'lucide-react';

export default function ApplicationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    loan_amount: location.state?.product?.max_loan_amount || 300000,
    loan_type: location.state?.product?.loan_type || 'fixed',
    property_value: 350000,
    down_payment: 60000,
    purpose: 'purchase',
    property_address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const application = await applicationsAPI.create(formData);
      toast.success('Application created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create application:', error);
      toast.error('Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-4" style={{ fontFamily: 'Space Grotesk' }} data-testid="application-title">
            Mortgage Application
          </h1>
          <p className="text-lg text-[#667085]">
            Complete your application to get started
          </p>
        </div>

        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Space Grotesk' }}>Application Details</CardTitle>
            <CardDescription>Provide details about your loan and property</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="application-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="loan_amount">Loan Amount</Label>
                  <Input id="loan_amount" type="number" value={formData.loan_amount} onChange={(e) => setFormData({...formData, loan_amount: parseFloat(e.target.value)})} className="mt-2" required data-testid="loan-amount" />
                </div>
                <div>
                  <Label htmlFor="loan_type">Loan Type</Label>
                  <Select value={formData.loan_type} onValueChange={(value) => setFormData({...formData, loan_type: value})}>
                    <SelectTrigger className="mt-2" data-testid="loan-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Rate</SelectItem>
                      <SelectItem value="variable">Variable Rate</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="property_value">Property Value</Label>
                  <Input id="property_value" type="number" value={formData.property_value} onChange={(e) => setFormData({...formData, property_value: parseFloat(e.target.value)})} className="mt-2" required data-testid="property-value" />
                </div>
                <div>
                  <Label htmlFor="down_payment">Down Payment</Label>
                  <Input id="down_payment" type="number" value={formData.down_payment} onChange={(e) => setFormData({...formData, down_payment: parseFloat(e.target.value)})} className="mt-2" required data-testid="down-payment" />
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Select value={formData.purpose} onValueChange={(value) => setFormData({...formData, purpose: value})}>
                  <SelectTrigger className="mt-2" data-testid="purpose">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="refinance">Refinance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Property Address</Label>
                <div className="grid grid-cols-1 gap-4 mt-2">
                  <Input placeholder="Street Address" value={formData.property_address.street} onChange={(e) => setFormData({...formData, property_address: {...formData.property_address, street: e.target.value}})} required data-testid="address-street" />
                  <div className="grid grid-cols-3 gap-4">
                    <Input placeholder="City" value={formData.property_address.city} onChange={(e) => setFormData({...formData, property_address: {...formData.property_address, city: e.target.value}})} required data-testid="address-city" />
                    <Input placeholder="State" value={formData.property_address.state} onChange={(e) => setFormData({...formData, property_address: {...formData.property_address, state: e.target.value}})} required data-testid="address-state" />
                    <Input placeholder="ZIP" value={formData.property_address.zip} onChange={(e) => setFormData({...formData, property_address: {...formData.property_address, zip: e.target.value}})} required data-testid="address-zip" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1 border-[#E5E7EB] text-[#667085]" data-testid="cancel-application">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full" data-testid="submit-application">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}