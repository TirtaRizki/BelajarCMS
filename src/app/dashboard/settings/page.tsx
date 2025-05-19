
import { ThemeSwitcher } from '@/components/settings/ThemeSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, SlidersHorizontal, ShieldCheck, BellRing } from 'lucide-react';

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
                <CardTitle className="text-xl">Account & Security (Placeholder)</CardTitle>
            </div>
            <CardDescription>Manage your account details and security settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Change Password (Not implemented)</li>
                <li>Two-Factor Authentication (Not implemented)</li>
                <li>Login History (Not implemented)</li>
            </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
                <BellRing className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Notifications (Placeholder)</CardTitle>
            </div>
            <CardDescription>Configure your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Email Notifications (Not implemented)</li>
                <li>Push Notifications (Not implemented)</li>
                <li>Notification Sound (Not implemented)</li>
            </ul>
             <p className="mt-4 text-sm text-muted-foreground">Further application settings like data management, integrations, etc., would appear in dedicated sections here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
