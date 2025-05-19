
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, UserCircle, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types';

export function ProfileForm() {
  const { user, updateUserContext, isLoading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      setRole(user.role || '');
    }
  }, [user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setIsLoading(true);

    // Simulate API call to update profile
    // In a real app:
    // try {
    //   const response = await fetch(`/api/users/${user.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ displayName }),
    //   });
    //   if (!response.ok) throw new Error('Failed to update profile');
    //   const updatedUserFromApi = await response.json();
    //   updateUserContext({ displayName: updatedUserFromApi.displayName }); // Or update with full user object from API
    //   toast({
    //     title: "Profile Updated",
    //     description: "Your display name has been updated successfully.",
    //   });
    // } catch (error) {
    //   console.error("Failed to update profile:", error);
    //   toast({
    //     title: "Error",
    //     description: "Could not update profile information.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }

    // For this prototype, update context and localStorage directly
    await new Promise(resolve => setTimeout(resolve, 500));
    updateUserContext({ displayName });
    toast({
      title: "Profile Updated",
      description: "Your display name has been updated successfully.",
    });
    setIsLoading(false);
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="displayName" className="flex items-center">
          <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
          Display Name
        </Label>
        <Input
          id="displayName"
          type="text"
          placeholder="Enter your display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          className="disabled:opacity-70"
        />
         <p className="text-xs text-muted-foreground">Email address is not editable in this demo.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role" className="flex items-center">
          <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
          Role
        </Label>
        <Input
          id="role"
          type="text"
          value={role.charAt(0).toUpperCase() + role.slice(1)} // Capitalize role
          disabled
          className="disabled:opacity-70"
        />
         <p className="text-xs text-muted-foreground">Role is assigned by the system.</p>
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
