import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { profileAPI, documentsAPI } from '@/lib/api';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    ssn_last4: '',
    address: { street: '', city: '', state: '', zip: '' },
    employment_status: '',
    employer_name: '',
    annual_income: '',
    monthly_income: '',
    assets: '',
    liabilities: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileData, docsData] = await Promise.all([
        profileAPI.get(),
        documentsAPI.getAll()
      ]);
      setProfile(profileData);
      setDocuments(docsData);
      
      // Pre-fill form
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        dob: profileData.dob || '',
        ssn_last4: profileData.ssn_last4 || '',
        address: profileData.address || { street: '', city: '', state: '', zip: '' },
        employment_status: profileData.employment_status || '',
        employer_name: profileData.employer_name || '',
        annual_income: profileData.annual_income || '',
        monthly_income: profileData.monthly_income || '',
        assets: profileData.assets || '',
        liabilities: profileData.liabilities || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await profileAPI.update(formData);
      toast.success('Profile updated successfully!');
      fetchProfileData();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await documentsAPI.upload(file, docType);
      toast.success(`${docType} uploaded successfully!`);
      fetchProfileData();
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4C81]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-4" style={{ fontFamily: 'Space Grotesk' }} data-testid="profile-title">
            Your Profile
          </h1>
          <p className="text-lg text-[#667085]">
            Complete your profile to get better pre-qualification results
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-[#E5E7EB]">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk' }}>Personal Information</CardTitle>
                <CardDescription>Update your personal and financial information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="profile-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input id="first_name" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="mt-2" data-testid="first-name" />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input id="last_name" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="mt-2" data-testid="last-name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="mt-2" data-testid="dob" />
                    </div>
                    <div>
                      <Label htmlFor="ssn_last4">SSN Last 4 Digits</Label>
                      <Input id="ssn_last4" maxLength={4} value={formData.ssn_last4} onChange={(e) => setFormData({...formData, ssn_last4: e.target.value})} className="mt-2" data-testid="ssn" />
                    </div>
                  </div>

                  <div>
                    <Label>Address</Label>
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      <Input placeholder="Street Address" value={formData.address.street} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} data-testid="address-street" />
                      <div className="grid grid-cols-3 gap-4">
                        <Input placeholder="City" value={formData.address.city} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} data-testid="address-city" />
                        <Input placeholder="State" value={formData.address.state} onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} data-testid="address-state" />
                        <Input placeholder="ZIP" value={formData.address.zip} onChange={(e) => setFormData({...formData, address: {...formData.address, zip: e.target.value}})} data-testid="address-zip" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="employment_status">Employment Status</Label>
                      <Select value={formData.employment_status} onValueChange={(value) => setFormData({...formData, employment_status: value})}>
                        <SelectTrigger className="mt-2" data-testid="employment-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="employer_name">Employer Name</Label>
                      <Input id="employer_name" value={formData.employer_name} onChange={(e) => setFormData({...formData, employer_name: e.target.value})} className="mt-2" data-testid="employer-name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="annual_income">Annual Income</Label>
                      <Input id="annual_income" type="number" value={formData.annual_income} onChange={(e) => setFormData({...formData, annual_income: e.target.value})} className="mt-2" data-testid="annual-income" />
                    </div>
                    <div>
                      <Label htmlFor="assets">Total Assets</Label>
                      <Input id="assets" type="number" value={formData.assets} onChange={(e) => setFormData({...formData, assets: e.target.value})} className="mt-2" data-testid="assets" />
                    </div>
                  </div>

                  <Button type="submit" disabled={saving} className="w-full bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full h-12" data-testid="save-profile">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-[#E5E7EB]">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk' }}>Documents</CardTitle>
                <CardDescription>Upload your verification documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['passport', 'drivers_license', 'payslip', 'bank_statement'].map((docType) => (
                  <div key={docType} className="border border-[#E5E7EB] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{docType.replace('_', ' ')}</span>
                      {documents.some(d => d.type === docType) && <CheckCircle className="h-5 w-5 text-[#10B981]" />}
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, docType)} disabled={uploading} data-testid={`upload-${docType}`} />
                      <div className="flex items-center space-x-2 text-[#0F4C81] hover:text-[#0A3A61]">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Upload</span>
                      </div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] mt-6">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk' }}>KYC Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {profile?.kyc_status === 'verified' ? (
                    <><CheckCircle className="h-5 w-5 text-[#10B981]" /><span className="text-[#10B981]">Verified</span></>
                  ) : profile?.kyc_status === 'pending' ? (
                    <><FileText className="h-5 w-5 text-[#F59E0B]" /><span className="text-[#F59E0B]">Pending Review</span></>
                  ) : (
                    <><FileText className="h-5 w-5 text-[#667085]" /><span className="text-[#667085]">Incomplete</span></>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}