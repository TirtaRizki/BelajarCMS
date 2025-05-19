
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call for password reset request
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real application, you would trigger an email sending process here.
    // For this demo, we'll just show a confirmation message.
    setIsLoading(false);
    toast({
      title: "Password Reset Email Simulated",
      description: `If an account exists for ${email}, a password reset link has been (simulated) sent.`,
      duration: 7000,
    });
     // router.push('/login'); // Optionally redirect or stay on page
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
         <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-grow text-center">
                <CardTitle className="text-3xl font-bold">Forgot Password?</CardTitle>
                <CardDescription>Enter your email to reset your password</CardDescription>
            </div>
            <div className="w-8"></div> {/* Spacer */}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground"/>
                Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-base"
            />
          </div>
          <Button type="submit" className="w-full text-base py-3" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <KeyRound className="mr-2 h-5 w-5" />
            )}
            Send Reset Link
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm pt-4">
        <p className="text-muted-foreground">
          Remembered your password?{' '}
          <Link href="/login" passHref legacyBehavior>
            <Button variant="link" className="px-1 text-primary hover:text-primary/80">
              Sign In
            </Button>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
