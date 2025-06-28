
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, UserCircle, Mail, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const availableRoles: User['role'][] = ['ADMIN', 'AUTHOR', 'OPERATOR', 'USER'];

export function ProfileForm() {
  const { user, updateUserContext, isLoading: authLoading, backendOnline } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<User['role']>('USER');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const [initialName, setInitialName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [initialRole, setInitialRole] = useState<User['role']>('USER');

  useEffect(() => {
    if (user) {
      const currentName = user.name || '';
      const currentEmail = user.email || '';
      const currentRole = user.role || 'USER';
      setName(currentName);
      setEmail(currentEmail);
      setSelectedRole(currentRole);
      setInitialName(currentName);
      setInitialEmail(currentEmail);
      setInitialRole(currentRole);
    }
  }, [user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> = {};
    if (name !== initialName) updates.name = name;
    if (email !== initialEmail) updates.email = email;
    if (selectedRole !== initialRole) updates.role = selectedRole;

    if (Object.keys(updates).length === 0) {
      toast({ title: "No Changes", description: "You haven't made any changes to your profile." });
      return;
    }

    setIsProcessing(true);
    const updatedUser = await updateUserContext(updates);
    setIsProcessing(false);

    if (updatedUser) {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        });
        // Update initial state to prevent re-saving same data
        setInitialName(updatedUser.name);
        setInitialEmail(updatedUser.email);
        setInitialRole(updatedUser.role);
    } else {
        toast({
            title: "Update Failed",
            description: "Could not save your profile changes. Please try again.",
            variant: "destructive",
        });
        // Revert optimistic UI changes
        setName(initialName);
        setEmail(initialEmail);
        setSelectedRole(initialRole);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const isFormDisabled = isProcessing || !backendOnline;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {!backendOnline && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Backend Offline</AlertTitle>
            <AlertDescription>
                Profile cannot be updated while the application is in offline mode.
            </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center">
          <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isFormDisabled}
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
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isFormDisabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="flex items-center">
          <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
          Role
        </Label>
        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as User['role'])} disabled={isFormDisabled}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map(r => (
              <SelectItem key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isFormDisabled}>
        {isProcessing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Changes
      </Button>
    </form>
  );
}
