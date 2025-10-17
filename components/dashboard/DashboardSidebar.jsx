import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const DashboardSidebar = ({ navItems }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

  const NavItem = ({ item }) => {
    const commonClasses = 'flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-none w-full';
    
    if (item.isLocked) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={item.onClick}
                className={cn(commonClasses, 'text-muted-foreground/50 cursor-not-allowed justify-between')}
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
                <Lock className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upgrade your plan to unlock this feature.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <NavLink
        to={item.href}
        end={item.href.endsWith('/dashboard/artist') || item.href.endsWith('/dashboard/client')}
        className={({ isActive }) =>
          cn(
            commonClasses,
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-primary'
          )
        }
        style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}
      >
        <item.icon className="w-5 h-5 mr-3" />
        {item.label}
      </NavLink>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border-2 border-border p-6 rounded-none"
      style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'}}
    >
      <div className="text-center mb-8">
        <img  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary" alt="User avatar" src="https://images.unsplash.com/photo-1584448033645-b94648434db1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=faces&cs=srgb&w=500&h=500&fit=crop" />
        <h3 className="text-xl font-bold">{user?.user_metadata?.full_name || 'User'}</h3>
        <p className="text-sm text-muted-foreground font-mono">{user?.email}</p>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>
      <div className="mt-10">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={handleSignOut}>
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </motion.div>
  );
};

export default DashboardSidebar;