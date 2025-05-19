
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'nextadminlite_profile';

export function ProfileForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('admin@example.com'); // Hardcoded for demo
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const profileData = JSON.parse(storedProfile);
        setDisplayName(profileData.displayName || '');
      }
    } catch (error) {
      console.error("Failed to load profile from localStorage:", error);
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ displayName }));
      toast({
        title: "Profile Updated",
        description: "Your display name has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save profile to localStorage:", error);
      toast({
        title: "Error",
        description: "Could not save profile information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          type="text"
          placeholder="Enter your display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled // Email is not editable in this demo
          className="disabled:opacity-70"
        />
         <p className="text-xs text-muted-foreground">Email address is not editable in this demo.</p>
      </div>
      <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Changes
      </Button>
    </form>
  );
}
