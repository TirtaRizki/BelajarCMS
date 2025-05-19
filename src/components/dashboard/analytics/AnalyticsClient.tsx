
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Image, MessageSquare, Loader2 } from "lucide-react";
import type { ServerActionResponse, ImageItem, TestimonialItem } from '@/types';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { fetchImagesAction } from '@/app/actions/images';
import { fetchTestimonialsAction } from '@/app/actions/testimonials';
import { useToast } from '@/hooks/use-toast';

interface StatData {
  images: number | null;
  testimonials: number | null;
}

export function AnalyticsClient() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [imagesRes, testimonialsRes] = await Promise.all([
          fetchImagesAction(),
          fetchTestimonialsAction(),
        ]);
        
        setStats({
          images: (imagesRes.success && imagesRes.data) ? imagesRes.data.length : 0,
          testimonials: (testimonialsRes.success && testimonialsRes.data) ? testimonialsRes.data.length : 0,
        });

        if (!imagesRes.success) console.error("Error fetching images for analytics:", imagesRes.error);
        if (!testimonialsRes.success) console.error("Error fetching testimonials for analytics:", testimonialsRes.error);

      } catch (error) {
        console.error("Error loading stats from server actions for analytics:", error);
        toast({ title: "Analytics Error", description: "Could not load content statistics for analytics.", variant: "destructive" });
        setStats({ images: 0, testimonials: 0 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [toast]);

  const chartData = stats ? [
    { name: 'Images', count: stats.images ?? 0, fill: "hsl(var(--chart-1))" },
    { name: 'Testimonials', count: stats.testimonials ?? 0, fill: "hsl(var(--chart-2))" },
  ] : [];

  const chartConfig = {
    count: {
      label: "Total Items",
    },
    images: { label: "Images", color: "hsl(var(--chart-1))" },
    testimonials: { label: "Testimonials", color: "hsl(var(--chart-2))" },
  } satisfies Parameters<typeof ChartContainer>[0]["config"];


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Content Analytics</CardTitle>
          </div>
          <CardDescription>Overview of your application's content statistics. Data is sourced via server actions.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Counts Summary</CardTitle>
          <CardDescription>A snapshot of your current content totals.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading || !stats ? (
            <>
              <StatDisplayCard title="Total Images" icon={Image} valueContent={<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />} />
              <StatDisplayCard title="Total Testimonials" icon={MessageSquare} valueContent={<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />} />
            </>
          ) : (
            <>
              <StatDisplayCard title="Total Images" icon={Image} value={stats.images?.toString() ?? "0"} />
              <StatDisplayCard title="Total Testimonials" icon={MessageSquare} value={stats.testimonials?.toString() ?? "0"} />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Distribution</CardTitle>
          <CardDescription>Visual breakdown of content types.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-72">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <RechartsBarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis allowDecimals={false} tickMargin={10} axisLine={false} tickLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground py-10">No data available to display chart.</p>
          )}
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardHeader>
            <CardTitle>Advanced Analytics (Placeholder)</CardTitle>
            <CardDescription>Future sections for more detailed analytics like user engagement, content performance over time, etc., would appear here.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>User Traffic Trends (Not implemented)</li>
                <li>Content View Counts (Not implemented)</li>
                <li>Referral Sources (Not implemented)</li>
            </ul>
             <p className="mt-4 text-sm text-muted-foreground">
                Implementing these features would typically require a backend analytics service and database integration.
             </p>
        </CardContent>
      </Card>
    </div>
  );
}


interface StatDisplayCardProps {
  title: string;
  value?: string;
  icon: React.ElementType;
  valueContent?: React.ReactNode;
}
function StatDisplayCard({ title, value, icon: Icon, valueContent }: StatDisplayCardProps) {
  return (
    <Card className="p-4 shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-0">
            {valueContent ? <div className="mt-1">{valueContent}</div> : <div className="text-2xl font-bold">{value}</div>}
        </CardContent>
    </Card>
  )
}
