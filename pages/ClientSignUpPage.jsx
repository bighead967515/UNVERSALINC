import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, User, Mail, Key, ArrowRight, ArrowLeft, Phone, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StylePreferencesStep from '@/components/auth/StylePreferencesStep';

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }).optional().or(z.literal('')),
  terms: z.boolean().refine(val => val === true, { message: 'You must accept the Terms of Service.' }),
  privacy: z.boolean().refine(val => val === true, { message: 'You must accept the Privacy Policy.' }),
});

const ClientSignUpPage = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const processStep1 = (data) => {
    setFormData(data);
    setStep(2);
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast({ variant: 'destructive', title: 'Google Sign-Up Failed', description: error.message });
      setIsLoading(false);
    }
  };

  const handleSignUp = async (stylePreferences) => {
    setIsLoading(true);
    const finalData = { ...formData, preferred_styles: stylePreferences };

    const { data: { user }, error } = await supabase.auth.signUp({
      email: finalData.email,
      password: finalData.password,
      options: {
        data: {
          full_name: finalData.fullName,
          phone: finalData.phone,
          role: 'client',
        },
      },
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Sign up failed', description: error.message });
    } else if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
            full_name: finalData.fullName,
            phone: finalData.phone,
            // 'preferred_styles' can be added here if you have such a column
        })
        .eq('id', user.id);

      if (profileError) {
        toast({ variant: 'destructive', title: 'Profile update failed', description: profileError.message });
      } else {
        toast({ title: 'Success!', description: 'Please check your email to verify your account.' });
        navigate('/login');
      }
    }
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 40, damping: 15 } },
    exit: { opacity: 0, x: '-100%', transition: { ease: 'easeInOut' } },
  };

  return (
    <>
      <Helmet>
        <title>Client Sign Up - Universal Inc</title>
        <meta name="description" content="Create your client account to start finding the best tattoo artists." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <div className="cyber-card">
                  <div className="cyber-card-content">
                    <div className="text-center mb-8">
                      <h1 className="text-4xl font-black mb-2">Client <span className="gradient-text">Sign Up</span></h1>
                      <p className="text-muted-foreground font-mono">Find your perfect artist.</p>
                    </div>
                    
                    <Button variant="outline" className="w-full mb-4" onClick={handleGoogleSignUp} disabled={isLoading}>
                      <Chrome className="mr-2 h-5 w-5" />
                      Sign Up with Google
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with email
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit(processStep1)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input id="fullName" type="text" placeholder="John Doe" {...register('fullName')} className="pl-10" />
                        </div>
                        {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="you@example.com" {...register('email')} className="pl-10" />
                        </div>
                        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input id="phone" type="tel" placeholder="(123) 456-7890" {...register('phone')} className="pl-10" />
                        </div>
                        {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input id="password" type="password" placeholder="••••••••" {...register('password')} className="pl-10" />
                        </div>
                        {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" {...register('terms')} />
                          <Label htmlFor="terms" className="text-sm font-normal">
                            I agree to the <Link to="/terms-of-service" target="_blank" className="underline text-primary">Terms of Service</Link>
                          </Label>
                        </div>
                        {errors.terms && <p className="text-destructive text-sm mt-1">{errors.terms.message}</p>}
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox id="privacy" {...register('privacy')} />
                          <Label htmlFor="privacy" className="text-sm font-normal">
                            I agree to the <Link to="/privacy-policy" target="_blank" className="underline text-primary">Privacy Policy</Link>
                          </Label>
                        </div>
                        {errors.privacy && <p className="text-destructive text-sm mt-1">{errors.privacy.message}</p>}
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </form>
                    <p className="text-center text-sm text-muted-foreground mt-6">
                      Already have an account? <Link to="/login" className="text-primary hover:underline">Log In</Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <div className="cyber-card">
                  <div className="cyber-card-content">
                    <Button variant="ghost" onClick={() => setStep(1)} className="mb-4">
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <StylePreferencesStep onComplete={handleSignUp} isLoading={isLoading} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ClientSignUpPage;