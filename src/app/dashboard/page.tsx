
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Image, MessageSquare, Newspaper, FileText, BarChart3, Settings, Loader2 } from "lucide-react";
import type { ImageItem, TestimonialItem, NewsItem, ArticleItem } from '@/types';

const IMAGE_STORAGE_KEY = 'nextadminlite_images';
const TESTIMONIAL_STORAGE_KEY = 'nextadminlite_testimonials';
const NEWS_STORAGE_KEY = 'nextadminlite_news';
const ARTICLES_STORAGE_KEY = 'nextadminlite_articles';

export default function DashboardOverviewPage() {
  const [imageCount, setImageCount] = useState<number | null>(null);
  const [testimonialCount, setTestimonialCount] = useState<number | null>(null);
  const [newsCount, setNewsCount] = useState<number | null>(null);
  const [articleCount, setArticleCount] = useState<number | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    try {
      const storedImages = localStorage.getItem(IMAGE_STORAGE_KEY);
      if (storedImages) {
        const parsedImages: ImageItem[] = JSON.parse(storedImages);
        setImageCount(parsedImages.length);
      } else {
        setImageCount(0);
      }

      const storedTestimonials = localStorage.getItem(TESTIMONIAL_STORAGE_KEY);
      if (storedTestimonials) {
        const parsedTestimonials: TestimonialItem[] = JSON.parse(storedTestimonials);
        setTestimonialCount(parsedTestimonials.length);
      } else {
        setTestimonialCount(0);
      }

      const storedNews = localStorage.getItem(NEWS_STORAGE_KEY);
      if (storedNews) {
        const parsedNews: NewsItem[] = JSON.parse(storedNews);
        setNewsCount(parsedNews.length);
      } else {
        setNewsCount(0);
      }

      const storedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (storedArticles) {
        const parsedArticles: ArticleItem[] = JSON.parse(storedArticles);
        setArticleCount(parsedArticles.length);
      } else {
        setArticleCount(0);
      }
    } catch (error) {
      console.error("Error loading stats from localStorage:", error);
      // Set counts to 0 or handle error display as needed
      setImageCount(0);
      setTestimonialCount(0);
      setNewsCount(0);
      setArticleCount(0);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

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
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>A brief overview of your content.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoadingStats ? (
            <>
              <StatCard title="Total Images" valueContent={<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />} />
              <StatCard title="Total Testimonials" valueContent={<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />} />
              <StatCard title="News Articles" valueContent={<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />} />
              <StatCard title="Published Articles" valueContent={<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />} />
            </>
          ) : (
            <>
              <StatCard title="Total Images" value={imageCount !== null ? imageCount.toString() : "N/A"} />
              <StatCard title="Total Testimonials" value={testimonialCount !== null ? testimonialCount.toString() : "N/A"} />
              <StatCard title="News Articles" value={newsCount !== null ? newsCount.toString() : "N/A"} />
              <StatCard title="Published Articles" value={articleCount !== null ? articleCount.toString() : "N/A"} />
            </>
          )}
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
  value?: string;
  valueContent?: React.ReactNode;
}
function StatCard({ title, value, valueContent }: StatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      {valueContent ? <div className="mt-1">{valueContent}</div> : <p className="text-2xl font-bold">{value}</p>}
    </Card>
  )
}
