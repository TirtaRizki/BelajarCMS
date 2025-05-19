
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as UiSidebar, 
  SidebarHeader as UiSidebarHeader, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Image, MessageSquare, Newspaper, FileText, User, Settings, LogOut, PanelLeftClose, PanelLeftOpen, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/images', label: 'Image Management', icon: Image },
  { href: '/dashboard/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/dashboard/news', label: 'News (Berita)', icon: Newspaper },
  { href: '/dashboard/articles', label: 'Articles (Konten)', icon: FileText },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { type: 'separator' as const },
  { href: '/dashboard/profile', label: 'User Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { setOpen, open, isMobile } = useSidebar(); // isMobile to conditionally render behavior

  return (
    <UiSidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r bg-card text-card-foreground"
      sheetTitle="Askhajaya Menu" 
    >
      <UiSidebarHeader className="p-2 flex justify-between items-center">
        {/* Expanded Logo/Title for Desktop */}
        <Link href="/dashboard" className={cn(
            "flex items-center gap-2",
            "group-data-[collapsible=icon]:group-data-[state=expanded]:inline",
            "group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden",
            isMobile && "hidden" // Hide on mobile as sheet has its own title
            )}>
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <span className="text-lg font-semibold">Askhajaya</span>
        </Link>
         {/* Collapsed Logo (Icon only) for Desktop */}
        <Link href="/dashboard" className={cn(
            "items-center",
            "group-data-[collapsible=icon]:group-data-[state=expanded]:hidden",
            "group-data-[collapsible=icon]:group-data-[state=collapsed]:flex",
            "hidden md:flex justify-center w-full", // Ensure it's hidden on mobile unless specifically handled
             isMobile && "hidden" 
            )}>
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </Link>
        {/* Mobile specific: Hamburger to close sheet. Desktop uses its own trigger in AppHeader. */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="md:hidden">
              {open ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        )}
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
                          <item.icon className="h-4 w-4" /> {/* Ensure icon size is consistent */}
                          <span className="truncate">{item.label}</span>
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
          className={cn(
            "w-full justify-start gap-2 text-left p-2 h-8 text-sm", // Base styles for expanded
             // Styles for collapsed from parent Sidebar's group state
            "group-data-[state=collapsed]/sidebar:w-8 group-data-[state=collapsed]/sidebar:h-8 group-data-[state=collapsed]/sidebar:p-0 group-data-[state=collapsed]/sidebar:justify-center"
          )}
          onClick={logout}
          title="Logout" // Tooltip for collapsed state
        >
          <LogOut className="h-4 w-4" /> {/* Consistent icon size */}
          {/* Text span hidden in collapsed state by parent Sidebar's group state */}
          <span className="truncate group-data-[state=collapsed]/sidebar:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </UiSidebar>
  );
}
