import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock, Phone } from 'lucide-react';

export default function SignupPage() {
  const location = useLocation();
  const fromEllen = location.state?.fromEllen;
  const ellenData = location.state?.userData || {};
  
  const [email, setEmail] = useState(ellenData.email || '');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signup(email, password, phone || null);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Signup failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Link to="/" className="inline-flex items-center text-[#0F4C81] mb-8 hover:text-[#0A3A61]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E5E7EB]">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#0F4C81] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h2
              className="text-3xl font-bold text-[#0A1929] mb-2"
              style={{ fontFamily: 'Space Grotesk' }}
              data-testid="signup-title"
            >
              {fromEllen ? `Almost there, ${ellenData.firstName}!` : 'Create Your Account'}
            </h2>
            <p className="text-[#667085]">
              {fromEllen ? 'Just a few more details to save your progress' : 'Start your journey to homeownership today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="signup-form">
            <div>
              <Label htmlFor="email" className="text-[#0A1929] font-medium">
                Email Address
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#667085]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 border-[#E5E7EB] focus:border-[#0F4C81] focus:ring-[#0F4C81]"
                  placeholder="you@example.com"
                  data-testid="signup-email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-[#0A1929] font-medium">
                Password
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#667085]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-12 border-[#E5E7EB] focus:border-[#0F4C81] focus:ring-[#0F4C81]"
                  placeholder="••••••••"
                  data-testid="signup-password"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-[#0A1929] font-medium">
                Phone Number (Optional)
              </Label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-[#667085]" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-12 border-[#E5E7EB] focus:border-[#0F4C81] focus:ring-[#0F4C81]"
                  placeholder="+1 (555) 000-0000"
                  data-testid="signup-phone"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full text-lg font-medium"
              data-testid="signup-submit"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#667085]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0F4C81] font-medium hover:underline" data-testid="signup-login-link">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}