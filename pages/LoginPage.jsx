import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Facebook } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast({ variant: "destructive", title: "Authentication Failed", description: error.message });
    } else {
      toast({ variant: 'cyber', title: "Connection Established", description: "Welcome back, operator." });
      navigate('/');
    }
  };

  const handleSocialLogin = (provider) => {
    toast({
      variant: 'cyber',
      title: `🚧 ${provider} Link Unavailable`,
      description: "Social Matrix uplink is currently offline. Please use standard credentials.",
    });
  };

  const handleForgotPassword = () => {
    toast({
      variant: 'cyber',
      title: "🚧 Memory Corruption",
      description: "Password recovery system offline for maintenance. Please try again later.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Login - InkConnect</title>
        <meta name="description" content="Login to your InkConnect account." />
      </Helmet>
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="cyber-card">
            <div className="cyber-card-content">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl text-primary">Authenticate</CardTitle>
                <CardDescription>Access the InkConnect Grid.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Uplink ID (Email)</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="operator@domain.net" />
                    {errors.email && <p className="text-sm text-destructive font-mono mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Passkey</Label>
                    <Input id="password" type="password" {...register("password")} placeholder="************" />
                    {errors.password && <p className="text-sm text-destructive font-mono mt-1">{errors.password.message}</p>}
                  </div>
                  <div className="flex items-center justify-end">
                    <button type="button" onClick={handleForgotPassword} className="text-sm underline text-muted-foreground hover:text-primary font-mono">
                      Forgot Passkey?
                    </button>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Connecting...' : 'Connect'}
                  </Button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-mono">
                      // Alternative Matrix //
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => handleSocialLogin('Google')}>
                     <Chrome className="w-4 h-4 mr-2" /> Google
                  </Button>
                  <Button variant="outline" onClick={() => handleSocialLogin('Facebook')}>
                     <Facebook className="w-4 h-4 mr-2" /> Facebook
                  </Button>
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground font-mono">
                  No account?{' '}
                  <Link to="/signup" className="underline hover:text-primary">
                    Request access
                  </Link>
                </p>
              </CardContent>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;