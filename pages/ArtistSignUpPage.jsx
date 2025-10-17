import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PartyPopper, Loader2 } from 'lucide-react';

const steps = [
  { id: 'Step 1', name: 'Account Credentials' },
  { id: 'Step 2', name: 'Studio & Contact' },
  { id: 'Step 3', name: 'Style & Bio' },
  { id: 'Step 4', name: 'Profile Images' },
];

const tattooStyles = [
  'Neo-Traditional', 'Blackwork', 'Watercolor', 'Realism', 'Traditional', 
  'Japanese', 'Minimalist', 'Dotwork', 'Tribal', 'Geometric'
];

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
  isLicensed: z.boolean().default(false),
  studioName: z.string().optional(),
  studioAddress: z.string().min(5, "Studio address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  zipCode: z.string().min(5, "Valid Zip Code is required."),
  phone: z.string().min(10, "Valid phone number is required."),
  profilePic: z.any().optional(),
  portfolioImages: z.any().optional(),
  styles: z.array(z.string()).min(1, "Select at least one style."),
  bio: z.string().min(50, "Bio must be at least 50 characters.").max(500, "Bio cannot exceed 500 characters."),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

const StepIndicator = ({ currentStep }) => (
  <nav aria-label="Progress">
    <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
      {steps.map((step, index) => (
        <li key={step.name} className="md:flex-1">
          {index < currentStep ? (
            <div className="group flex flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">{step.id}</span>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          ) : index === currentStep ? (
            <div className="flex flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
              <span className="text-sm font-medium text-primary">{step.id}</span>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          ) : (
            <div className="group flex flex-col border-l-4 border-border py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-muted-foreground">{step.id}</span>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

const ArtistSignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, trigger, getValues, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      styles: [],
    }
  });

  const handleNext = async () => {
    let fieldsToValidate;
    switch (currentStep) {
      case 0:
        fieldsToValidate = ['fullName', 'email', 'password', 'confirmPassword'];
        break;
      case 1:
        fieldsToValidate = ['studioAddress', 'city', 'state', 'zipCode', 'phone'];
        break;
      case 2:
        fieldsToValidate = ['styles', 'bio'];
        break;
      case 3:
        fieldsToValidate = []; // No validation on file inputs for now
        break;
      default:
        fieldsToValidate = [];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data) => {
    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: 'artist'
        }
      }
    });

    if (authError) {
      return toast({ variant: "destructive", title: "Sign Up Failed", description: authError.message });
    }
    
    if (!authData.user) {
        return toast({ variant: "destructive", title: "Sign Up Failed", description: "Could not create user account. Please try again." });
    }

    // 2. Create artist profile
    const { error: profileError } = await supabase
      .from('artists')
      .insert([
        { 
          user_id: authData.user.id,
          name: data.fullName,
          studio_name: data.studioName,
          location: `${data.city}, ${data.state}`,
          contact: JSON.stringify({ phone: data.phone, email: data.email }),
          bio: data.bio,
          style: data.styles.join(', '),
          // Placeholders for now
          image_url: `https://images.unsplash.com/photo-1557053910-d9eadeed1c58?q=80&w=2787&auto=format&fit=crop`,
          cover_image_url: `https://images.unsplash.com/photo-1620173831411-9653f53c1393?q=80&w=2894&auto=format&fit=crop`,
          rating: 0,
          reviews: 0,
          verified: data.isLicensed,
        }
      ]);
      
    if (profileError) {
        return toast({ variant: "destructive", title: "Profile Creation Failed", description: profileError.message });
    }

    toast({
        variant: "cyber",
        title: "Account Created!",
        description: "Your artist profile is ready. Please check your email to verify your account.",
        duration: 8000
    });
    navigate('/login');
  };
  
  const handleStyleChange = (style) => {
    const currentStyles = getValues("styles");
    const newStyles = currentStyles.includes(style) 
      ? currentStyles.filter(s => s !== style)
      : [...currentStyles, style];
    setValue("styles", newStyles, { shouldValidate: true });
  }

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl text-primary">Account Credentials</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name / Alias</Label>
                <Input id="fullName" {...register("fullName")} placeholder="e.g. John Doe"/>
                {errors.fullName && <p className="text-destructive text-sm mt-1 font-mono">{errors.fullName.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register("email")} placeholder="you@example.com"/>
                {errors.email && <p className="text-destructive text-sm mt-1 font-mono">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} placeholder="Min. 8 characters"/>
                {errors.password && <p className="text-destructive text-sm mt-1 font-mono">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="Re-enter your password"/>
                {errors.confirmPassword && <p className="text-destructive text-sm mt-1 font-mono">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl text-primary">Studio & Contact</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="studioName">Studio Name (Optional)</Label>
                <Input id="studioName" {...register("studioName")} placeholder="e.g. Chrome Canvas Tattoos" />
              </div>
              <div>
                <Label htmlFor="studioAddress">Studio Address</Label>
                <Input id="studioAddress" {...register("studioAddress")} placeholder="123 Cyber Street"/>
                {errors.studioAddress && <p className="text-destructive text-sm mt-1 font-mono">{errors.studioAddress.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city")} placeholder="Los Angeles"/>
                  {errors.city && <p className="text-destructive text-sm mt-1 font-mono">{errors.city.message}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" {...register("state")} placeholder="California"/>
                  {errors.state && <p className="text-destructive text-sm mt-1 font-mono">{errors.state.message}</p>}
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip / Postal Code</Label>
                  <Input id="zipCode" {...register("zipCode")} placeholder="90001"/>
                  {errors.zipCode && <p className="text-destructive text-sm mt-1 font-mono">{errors.zipCode.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Public Contact Phone</Label>
                <Input id="phone" type="tel" {...register("phone")} placeholder="(555) 123-4567"/>
                {errors.phone && <p className="text-destructive text-sm mt-1 font-mono">{errors.phone.message}</p>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl text-primary">Style & Bio</h3>
            <div>
              <Label>Tattoo Styles</Label>
              <p className="text-sm text-muted-foreground mb-3 font-mono">Select all that you specialize in. This helps clients find you.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {tattooStyles.map(style => (
                  <label key={style} htmlFor={style} className="flex items-center space-x-3 bg-input p-3 cursor-pointer hover:bg-muted transition-colors rounded-none" style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'}}>
                    <Checkbox id={style} onCheckedChange={() => handleStyleChange(style)} checked={getValues("styles").includes(style)} />
                    <span className="font-mono text-sm text-foreground">{style}</span>
                  </label>
                ))}
              </div>
              {errors.styles && <p className="text-destructive text-sm mt-2 font-mono">{errors.styles.message}</p>}
            </div>
            <div>
              <Label htmlFor="bio">Artist Bio</Label>
              <Textarea id="bio" rows={6} {...register("bio")} className="bg-input border-border focus:bg-background transition-colors" placeholder="Tell clients about your art, style, and experience. (Min 50 characters)" />
              {errors.bio && <p className="text-destructive text-sm mt-1 font-mono">{errors.bio.message}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl text-primary">Profile Images</h3>
            <div>
              <Label htmlFor="profilePic">Profile Picture (Avatar)</Label>
              <Input id="profilePic" type="file" {...register("profilePic")} className="file:text-primary file:font-bold file:uppercase file:tracking-wider"/>
              <p className="text-sm text-muted-foreground mt-1 font-mono">This will be your main avatar on the site. 400x400 recommended.</p>
            </div>
            <div>
              <Label htmlFor="portfolioImages">Initial Portfolio Images (up to 5)</Label>
              <Input id="portfolioImages" type="file" multiple {...register("portfolioImages")} className="file:text-primary file:font-bold file:uppercase file:tracking-wider"/>
               <p className="text-sm text-muted-foreground mt-1 font-mono">Showcase your best work! You can add more later.</p>
            </div>
             <p className="text-center text-accent p-3 bg-accent/10 font-mono text-sm">Note: File uploads are for demonstration. You will manage your portfolio from your artist dashboard after sign up.</p>
             <div className="flex items-center space-x-3 bg-input p-4">
              <Checkbox id="isLicensed" {...register("isLicensed")} />
              <Label htmlFor="isLicensed" className="text-sm">I confirm I am a licensed tattoo artist (where applicable) and adhere to all local health & safety regulations.</Label>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <Helmet>
        <title>Artist Sign Up - InkConnect</title>
        <meta name="description" content="Join InkConnect as a tattoo artist and showcase your portfolio to new clients." />
      </Helmet>
      <div className="container mx-auto max-w-4xl p-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-center text-5xl font-black mb-4">Artist <span className="gradient-text">Sign Up</span></h1>
          <p className="text-center text-lg text-muted-foreground mb-12 font-mono">Follow the steps to create your profile and connect with clients.</p>

          <div className="mb-12">
            <StepIndicator currentStep={currentStep} />
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="cyber-card"
          >
            <div className="cyber-card-content min-h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="mt-8 flex justify-between items-center">
            <div>
            {currentStep > 0 && (
              <Button type="button" variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            </div>
            
            <div>
            {currentStep < steps.length - 1 && (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="submit" className="bg-accent hover:bg-green-400 text-black" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <PartyPopper className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ArtistSignUpPage;