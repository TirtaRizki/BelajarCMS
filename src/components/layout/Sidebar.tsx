
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as UiSidebar, // Renamed to UiSidebar to avoid conflict
  SidebarHeader as UiSidebarHeader, // Renamed to UiSidebarHeader
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  // SheetTitle was removed from here, it's handled by UiSidebar directly
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Image, MessageSquare, Newspaper, FileText, User, Settings, LogOut, PanelLeftClose, PanelLeftOpen, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/images', label: 'Image Management', icon: Image },
  { href: '/dashboard/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/dashboard/news', label: 'News (Berita)', icon: Newspaper },
  { href: '/dashboard/articles', label: 'Articles (Konten)', icon: FileText },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { type: 'separator' },
  { href: '/dashboard/profile', label: 'User Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { setOpen, open } = useSidebar();

  return (
    <UiSidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r bg-card text-card-foreground"
      sheetTitle="Askhajaya Menu" 
    >
      <UiSidebarHeader className="p-2 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:group-data-[state=expanded]:inline group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <span className="text-lg font-semibold">Askhajaya</span>
        </Link>
         {/* Simplified logo for collapsed state, or can be hidden if text shows beside icon buttons */}
        <Link href="/dashboard" className="items-center gap-2 group-data-[collapsible=icon]:group-data-[state=expanded]:hidden group-data-[collapsible=icon]:group-data-[state=collapsed]:flex hidden md:flex justify-center w-full">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </UiSidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item, index) =>
              item.type === 'separator' ? (
                <hr key={`sep-${index}`} className="my-2 border-border" />
              ) : (
                item.href && (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} passHref legacyBehavior>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                        tooltip={item.label}
                      >
                        <a>
                          <item.icon className="h-5 w-5" />
                          {/* Removed hiding class to always show text */}
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )
              )
            )}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:group-data-[state=collapsed]:justify-start" // Keep text left-aligned when collapsed
          onClick={logout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
           {/* Removed hiding class to always show text */}
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </UiSidebar>
  );
}
