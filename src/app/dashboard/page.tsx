
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Image, MessageSquare, Newspaper, FileText, BarChart3, Settings } from "lucide-react";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to Askhajaya Dashboard</CardTitle>
          <CardDescription>Manage your application's content and settings from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Use the sidebar navigation to access different management sections of your application.
            Here are some quick links to get you started:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardLinkCard
              href="/dashboard/images"
              icon={Image}
              title="Image Management"
              description="Upload, view, and manage your images."
            />
            <DashboardLinkCard
              href="/dashboard/testimonials"
              icon={MessageSquare}
              title="Testimonials"
              description="Add and organize customer testimonials."
            />
            <DashboardLinkCard
              href="/dashboard/news"
              icon={Newspaper}
              title="News (Berita)"
              description="Create and publish news articles."
            />
            <DashboardLinkCard
              href="/dashboard/articles"
              icon={FileText}
              title="Articles (Konten)"
              description="Manage your content articles."
            />
             <DashboardLinkCard
              href="/dashboard/settings"
              icon={Settings}
              title="Application Settings"
              description="Configure application preferences."
            />
             <DashboardLinkCard
              href="#"
              icon={BarChart3}
              title="Analytics (Placeholder)"
              description="View application usage statistics."
              disabled
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats (Placeholder)</CardTitle>
          <CardDescription>A brief overview of your content.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Images" value="0" />
          <StatCard title="Total Testimonials" value="0" />
          <StatCard title="News Articles" value="0" />
          <StatCard title="Published Articles" value="0" />
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardLinkCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  disabled?: boolean;
}

function DashboardLinkCard({ href, icon: Icon, title, description, disabled }: DashboardLinkCardProps) {
  return (
    <Link href={href} passHref legacyBehavior={true}>
      <a className={`block p-1 ${disabled ? 'pointer-events-none' : ''}`}>
        <Card className={`hover:shadow-md transition-shadow h-full ${disabled ? 'opacity-50 bg-muted' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}

interface StatCardProps {
  title: string;
  value: string;
}
function StatCard({ title, value }: StatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  )
}
