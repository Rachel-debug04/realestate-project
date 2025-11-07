import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, FileText, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { applicationsAPI, profileAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appsData, profileData] = await Promise.all([
        applicationsAPI.getAll(),
        profileAPI.get()
      ]);
      setApplications(appsData);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    const fields = ['first_name', 'last_name', 'dob', 'address', 'employment_status', 'annual_income'];
    const completed = fields.filter(field => profile[field]).length;
    return (completed / fields.length) * 100;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-[#10B981]" />;
      case 'submitted':
      case 'under_review':
        return <Clock className="h-5 w-5 text-[#F59E0B]" />;
      case 'conditional':
        return <AlertCircle className="h-5 w-5 text-[#F59E0B]" />;
      case 'denied':
        return <AlertCircle className="h-5 w-5 text-[#EF4444]" />;
      default:
        return <FileText className="h-5 w-5 text-[#667085]" />;
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
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-4"
            style={{ fontFamily: 'Space Grotesk' }}
            data-testid="dashboard-title"
          >
            Welcome Back!
          </h1>
          <p className="text-lg text-[#667085]">
            Here's an overview of your mortgage journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Button
            onClick={() => navigate('/advisor')}
            className="h-24 bg-white hover:bg-[#F8F9FA] text-[#0F4C81] border-2 border-[#E5E7EB] hover:border-[#0F4C81] rounded-2xl flex items-center justify-center space-x-4 shadow-sm"
            data-testid="quick-action-advisor"
          >
            <MessageSquare className="h-8 w-8" />
            <span className="text-lg font-semibold">Talk to Ellen</span>
          </Button>

          <Button
            onClick={() => navigate('/prequal')}
            className="h-24 bg-white hover:bg-[#F8F9FA] text-[#0F4C81] border-2 border-[#E5E7EB] hover:border-[#0F4C81] rounded-2xl flex items-center justify-center space-x-4 shadow-sm"
            data-testid="quick-action-prequal"
          >
            <TrendingUp className="h-8 w-8" />
            <span className="text-lg font-semibold">Get Pre-Qualified</span>
          </Button>

          <Button
            onClick={() => navigate('/application')}
            className="h-24 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-2xl flex items-center justify-center space-x-4 shadow-sm"
            data-testid="quick-action-apply"
          >
            <FileText className="h-8 w-8" />
            <span className="text-lg font-semibold">Start Application</span>
          </Button>
        </div>

        {/* Profile Completeness */}
        {getProfileCompleteness() < 100 && (
          <Card className="mb-8 border-[#E5E7EB]" data-testid="profile-completeness-card">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Space Grotesk' }}>Complete Your Profile</CardTitle>
              <CardDescription>
                Complete your profile to get better pre-qualification results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={getProfileCompleteness()} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#667085]">
                    {Math.round(getProfileCompleteness())}% Complete
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    className="border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white"
                    data-testid="complete-profile-btn"
                  >
                    Complete Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications */}
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Space Grotesk' }}>Your Applications</CardTitle>
            <CardDescription>
              Track the status of your mortgage applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12" data-testid="no-applications">
                <FileText className="h-16 w-16 text-[#A9CCE3] mx-auto mb-4" />
                <p className="text-[#667085] mb-4">You haven't started any applications yet</p>
                <Button
                  onClick={() => navigate('/application')}
                  className="bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full"
                  data-testid="start-first-application"
                >
                  Start Your First Application
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-6 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] hover:border-[#0F4C81] cursor-pointer"
                    onClick={() => navigate(`/application?id=${app.id}`)}
                    data-testid={`application-${app.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(app.status)}
                      <div>
                        <p className="font-semibold text-[#0A1929]">
                          {formatCurrency(app.loan_amount)} {app.loan_type} Loan
                        </p>
                        <p className="text-sm text-[#667085]">
                          {app.property_address.street}, {app.property_address.city}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#E8F4F8] text-[#0F4C81] capitalize">
                        {app.status.replace('_', ' ')}
                      </span>
                      {app.updated_at && (
                        <p className="text-sm text-[#667085] mt-1">
                          Updated {formatDate(app.updated_at)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}