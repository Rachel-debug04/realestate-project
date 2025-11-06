import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
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
              <span className="text-white font-bold text-2xl">EM</span>
            </div>
            <h2
              className="text-3xl font-bold text-[#0A1929] mb-2"
              style={{ fontFamily: 'Space Grotesk' }}
              data-testid="login-title"
            >
              Welcome Back
            </h2>
            <p className="text-[#667085]">
              Log in to continue your mortgage journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
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
                  data-testid="login-email"
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
                  data-testid="login-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full text-lg font-medium"
              data-testid="login-submit"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#667085]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#0F4C81] font-medium hover:underline" data-testid="login-signup-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}