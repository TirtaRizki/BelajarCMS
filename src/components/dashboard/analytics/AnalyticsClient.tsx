
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LibraryBig, Loader2, Users, Eye, Link2, Package } from "lucide-react";
import type { ServerActionResponse, MediaItem, ProductItem } from '@/types';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart as RechartsLineChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchMediaItemsAction } from '@/app/actions/media';
import { fetchProductsAction } from '@/app/actions/products';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface StatData {
  media: number | null;
  products: number | null;
}

// Mock data for advanced analytics
const mockTrafficData = [
  { date: 'Mon', visits: Math.floor(Math.random() * 500) + 200 },
  { date: 'Tue', visits: Math.floor(Math.random() * 500) + 250 },
  { date: 'Wed', visits: Math.floor(Math.random() * 500) + 300 },
  { date: 'Thu', visits: Math.floor(Math.random() * 500) + 280 },
  { date: 'Fri', visits: Math.floor(Math.random() * 500) + 400 },
  { date: 'Sat', visits: Math.floor(Math.random() * 500) + 600 },
  { date: 'Sun', visits: Math.floor(Math.random() * 500) + 550 },
];

const mockContentViews = [
  { contentName: 'Our Best Selling Keripik', views: Math.floor(Math.random() * 1500) + 700, type: 'Product' },
  { contentName: 'Introduction to Next.js', views: Math.floor(Math.random() * 1000) + 500, type: 'Article' },
  { contentName: 'Summer Collection Launch', views: Math.floor(Math.random() * 800) + 400, type: 'News' },
  { contentName: 'Product Showcase Video', views: Math.floor(Math.random() * 1200) + 600, type: 'Media' },
  { contentName: 'Advanced Tailwind Techniques', views: Math.floor(Math.random() * 700) + 300, type: 'Article' },
  { contentName: 'Community Meetup Highlights', views: Math.floor(Math.random() * 600) + 250, type: 'News' },
];

const mockReferralSources = [
  { source: 'Google', count: Math.floor(Math.random() * 2000) + 1000, change: `+${(Math.random() * 5 + 1).toFixed(1)}%` },
  { source: 'Instagram', count: Math.floor(Math.random() * 1500) + 700, change: `+${(Math.random() * 4 + 1).toFixed(1)}%` },
  { source: 'Twitter / X', count: Math.floor(Math.random() * 1000) + 500, change: `-${(Math.random() * 3 + 0.5).toFixed(1)}%` },
  { source: 'Direct', count: Math.floor(Math.random() * 800) + 400, change: `+${(Math.random() * 2 + 0.5).toFixed(1)}%` },
  { source: 'Facebook', count: Math.floor(Math.random() * 500) + 200, change: `+${(Math.random() * 1 + 0.2).toFixed(1)}%` },
];


export function AnalyticsClient() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { backendOnline } = useAuth();

  const [trafficData, setTrafficData] = useState<typeof mockTrafficData>([]);
  const [contentViews, setContentViews] = useState<typeof mockContentViews>([]);
  const [referralSources, setReferralSources] = useState<typeof mockReferralSources>([]);


  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Media items are always mocked and available
        const mediaRes = await fetchMediaItemsAction();
        const mediaCount = (mediaRes.success && mediaRes.data) ? mediaRes.data.length : 0;
        
        let productCount = 0;
        // Products depend on backend status
        if (backendOnline) {
            const productsRes = await fetchProductsAction();
            if (productsRes.success && productsRes.data) {
                productCount = productsRes.data.length;
            } else {
                console.error("Error fetching products for analytics:", productsRes.error);
            }
        } else {
            // If offline, use the mock count for consistency
            productCount = 2; 
        }

        setStats({
          media: mediaCount,
          products: productCount,
        });

        // Set mock data for other charts
        setTrafficData(mockTrafficData);
        setContentViews(mockContentViews.sort((a, b) => b.views - a.views)); 
        setReferralSources(mockReferralSources.sort((a,b) => b.count - a.count));

      } catch (error) {
        console.error("Error loading stats from server actions for analytics:", error);
        toast({ title: "Analytics Error", description: "Could not load content statistics for analytics.", variant: "destructive" });
        setStats({ media: 0, products: 0 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [toast, backendOnline]);

  const contentCountChartData = stats ? [
    { name: 'Media', count: stats.media ?? 0, fill: "hsl(var(--chart-1))" },
    { name: 'Products', count: stats.products ?? 0, fill: "hsl(var(--chart-5))" },
  ] : [];

  const contentCountChartConfig = {
    count: { label: "Total Items" },
    media: { label: "Media", color: "hsl(var(--chart-1))" },
    products: { label: "Products", color: "hsl(var(--chart-5))" },
  } satisfies Parameters<typeof ChartContainer>[0]["config"];

  const trafficChartConfig = {
    visits: { label: "Visits", color: "hsl(var(--primary))" },
  } satisfies Parameters<typeof ChartContainer>[0]["config"];


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Content Analytics</CardTitle>
          </div>
          <CardDescription>Overview of your application's content and engagement statistics. Data is sourced via server actions and mock placeholders.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Counts Summary</CardTitle>
          <CardDescription>A snapshot of your current content totals.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {isLoading || !stats ? (
            <>
              <StatDisplayCard title="Total Media" icon={LibraryBig} valueContent={<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />} />
              <StatDisplayCard title="Total Products" icon={Package} valueContent={<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />} />
            </>
          ) : (
            <>
              <StatDisplayCard title="Total Media" icon={LibraryBig} value={stats.media?.toString() ?? "0"} />
              <StatDisplayCard title="Total Products" icon={Package} value={stats.products?.toString() ?? "0"} />
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
          ) : contentCountChartData.length > 0 ? (
            <ChartContainer config={contentCountChartConfig} className="min-h-[300px] w-full">
              <RechartsBarChart data={contentCountChartData} accessibilityLayer>
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
            <div className="flex items-center space-x-3 mb-1">
                <Users className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">User Traffic Trends (Last 7 Days)</CardTitle>
            </div>
            <CardDescription>Mock data representing website visits. In a real app, this would come from an analytics service.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-60">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : trafficData.length > 0 ? (
                 <ChartContainer config={trafficChartConfig} className="min-h-[250px] w-full">
                    <RechartsLineChart
                        data={trafficData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        accessibilityLayer
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} allowDecimals={false}/>
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{r: 6}}/>
                    </RechartsLineChart>
                </ChartContainer>
            ) : (
                <p className="text-center text-muted-foreground py-10">No traffic data available.</p>
            )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
            <div className="flex items-center space-x-3 mb-1">
                <Eye className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Top Content Views</CardTitle>
            </div>
            <CardDescription>Mock data for most viewed content. Real implementation would require view tracking.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <div className="space-y-3">
                    {[...Array(3)].map((_, i) => 
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                            <div className="w-3/4 h-4 bg-muted rounded animate-pulse"></div>
                            <div className="w-1/5 h-4 bg-muted rounded animate-pulse"></div>
                        </div>
                    )}
                </div>
            ) : contentViews.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Content Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contentViews.map((item) => (
                        <TableRow key={item.contentName}>
                            <TableCell className="font-medium">{item.contentName}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell className="text-right">{item.views.toLocaleString()}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-center text-muted-foreground py-10">No content view data available.</p>
            )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
            <div className="flex items-center space-x-3 mb-1">
                <Link2 className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Referral Sources</CardTitle>
            </div>
            <CardDescription>Mock data showing where traffic originates. Real data needs tracking parameters.</CardDescription>
        </CardHeader>
        <CardContent>
             {isLoading ? (
                 <div className="space-y-3">
                    {[...Array(3)].map((_, i) => 
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                            <div className="w-1/3 h-4 bg-muted rounded animate-pulse"></div>
                            <div className="w-1/4 h-4 bg-muted rounded animate-pulse"></div>
                            <div className="w-1/6 h-4 bg-muted rounded animate-pulse"></div>
                        </div>
                    )}
                </div>
            ) : referralSources.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Visitors</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {referralSources.map((item) => (
                        <TableRow key={item.source}>
                            <TableCell className="font-medium">{item.source}</TableCell>
                            <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                            <TableCell className={`text-right font-semibold ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {item.change}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                 <p className="text-center text-muted-foreground py-10">No referral data available.</p>
            )}
        </CardContent>
      </Card>
       <p className="mt-8 text-sm text-muted-foreground text-center">
        Advanced analytics data shown is for demonstration purposes only. A real implementation would require backend integration with an analytics service.
      </p>
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

    