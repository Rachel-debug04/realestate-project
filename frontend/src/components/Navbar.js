import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, LogOut, User, MessageSquare, CreditCard, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-[#0F4C81]" />
            <span className="text-xl font-bold text-[#0F4C81]" style={{ fontFamily: 'Space Grotesk' }}>
              EasyMortgage
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-[#667085] hover:text-[#0F4C81] font-medium transition-colors duration-200"
              data-testid="nav-dashboard"
            >
              Dashboard
            </Link>
            <Link
              to="/advisor"
              className="text-[#667085] hover:text-[#0F4C81] font-medium transition-colors duration-200"
              data-testid="nav-advisor"
            >
              Talk to Ellen
            </Link>
            <Link
              to="/products"
              className="text-[#667085] hover:text-[#0F4C81] font-medium transition-colors duration-200"
              data-testid="nav-products"
            >
              Products
            </Link>
            <Link
              to="/prequal"
              className="text-[#667085] hover:text-[#0F4C81] font-medium transition-colors duration-200"
              data-testid="nav-prequal"
            >
              Pre-Qualify
            </Link>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  data-testid="user-menu-trigger"
                >
                  <div className="w-8 h-8 rounded-full bg-[#A9CCE3] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#0F4C81]" />
                  </div>
                  <span className="hidden md:block font-medium">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="menu-profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/advisor')} data-testid="menu-advisor">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Talk to Ellen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/prequal')} data-testid="menu-prequal">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pre-Qualify
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/application')} data-testid="menu-application">
                  <FileText className="mr-2 h-4 w-4" />
                  Applications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}