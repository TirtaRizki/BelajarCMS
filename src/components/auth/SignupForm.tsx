
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both password fields are identical.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call for account creation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real application, you would handle user registration here,
    // potentially storing user data in a database.
    // For this demo, we'll just show a success message.

    setIsLoading(false);
    toast({
      title: "Account Creation Simulated",
      description: `An account for ${username} with email ${email} would be created here. You can now try logging in (any credentials will work for the demo).`,
      duration: 7000,
    });
    router.push('/login'); // Redirect to login page
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-grow text-center">
                <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                <CardDescription>Join NextAdmin Lite</CardDescription>
            </div>
            <div className="w-8"></div> {/* Spacer */}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full text-base py-3" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-5 w-5" />
            )}
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm pt-4">
        <p className="text-muted-foreground">
          Already have an account?{' '}
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
