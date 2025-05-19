
import { ThemeSwitcher } from '@/components/settings/ThemeSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, SlidersHorizontal } from 'lucide-react'; // Using Palette for theme

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
        <CardContent>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Palette className="mr-2 h-5 w-5 text-accent" />
            Appearance
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Choose your preferred color scheme.</p>
          <ThemeSwitcher />
        </CardContent>
      </Card>
      
      {/* Placeholder for more settings */}
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-xl">More Settings (Placeholder)</CardTitle>
            <CardDescription>Future application settings will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">This section is a placeholder for additional settings like notification preferences, language, etc.</p>
        </CardContent>
      </Card>
    </div>
  );
}
