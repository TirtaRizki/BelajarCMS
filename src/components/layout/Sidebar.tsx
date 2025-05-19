
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as UiSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Image, MessageSquare, Newspaper, FileText, User, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SheetTitle } from '@/components/ui/sheet'; // Added import for SheetTitle

const menuItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/images', label: 'Image Management', icon: Image },
  { href: '/dashboard/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/dashboard/news', label: 'News (Berita)', icon: Newspaper },
  { href: '/dashboard/articles', label: 'Articles (Konten)', icon: FileText },
  { type: 'separator' },
  { href: '/dashboard/profile', label: 'User Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { state, setOpen, open } = useSidebar();

  return (
    <UiSidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r bg-card text-card-foreground"
    >
      <SidebarHeader className="p-2 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <SheetTitle asChild>
            <span className="text-lg font-semibold">Askhajaya</span>
          </SheetTitle>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </SidebarHeader>
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
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
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
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center"
          onClick={logout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </UiSidebar>
  );
}
