
import { ThemeSwitcher } from '@/components/settings/ThemeSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, SlidersHorizontal, ShieldCheck, BellRing, Lock, Activity, MailOpen, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <SlidersHorizontal className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Application Settings</CardTitle>
          </div>
          <CardDescription>Manage your application preferences. Settings are saved locally.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Palette className="mr-2 h-5 w-5 text-accent" />
              Appearance
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Choose your preferred color scheme.</p>
            <ThemeSwitcher />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Account & Security</CardTitle>
            </div>
            <CardDescription>Manage your account details and security settings (placeholders).</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                    <Lock className="mr-3 h-4 w-4 text-gray-400" />
                    Change Password (Not implemented)
                </li>
                <li className="flex items-center">
                    <Smartphone className="mr-3 h-4 w-4 text-gray-400" />
                    Two-Factor Authentication (Not implemented)
                </li>
                <li className="flex items-center">
                    <Activity className="mr-3 h-4 w-4 text-gray-400" />
                    Login History & Active Sessions (Not implemented)
                </li>
                <li className="flex items-center">
                    <MailOpen className="mr-3 h-4 w-4 text-gray-400" />
                    Connected Accounts (e.g., Google, GitHub) (Not implemented)
                </li>
            </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
                <BellRing className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Notifications</CardTitle>
            </div>
            <CardDescription>Configure your notification preferences (placeholders).</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center justify-between">
                    <span className="flex items-center">
                        <MailOpen className="mr-3 h-4 w-4 text-gray-400" />
                        Email Notifications
                    </span>
                    <span className="text-xs">(Toggle - Not implemented)</span>
                </li>
                 <li className="flex items-center justify-between">
                    <span className="flex items-center">
                        <Smartphone className="mr-3 h-4 w-4 text-gray-400" />
                        Push Notifications
                    </span>
                    <span className="text-xs">(Toggle - Not implemented)</span>
                </li>
                <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-4 w-4 text-gray-400"><path d="M6 9v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"/><path d="M6 2h12v7H6z"/></svg>
                    Notification Sound (Not implemented)
                </li>
                 <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-4 w-4 text-gray-400"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    Mute All Notifications (Not implemented)
                </li>
            </ul>
             <p className="mt-6 text-sm text-muted-foreground">
                Further application settings like data management, integrations, API keys, etc., would appear in dedicated sections here or on their respective management pages.
             </p>
        </CardContent>
      </Card>
    </div>
  );
}
