import { LayoutDashboard, Sparkles, Ticket, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PrimaryNavItem = {
  label: string;
  mobileLabel: string;
  path: string;
  icon: LucideIcon;
};

export type PageMeta = {
  eyebrow: string;
  title: string;
  description?: string;
};

export const primaryNavItems: PrimaryNavItem[] = [
  {
    label: "Dashboard",
    mobileLabel: "Oversikt",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Kunder",
    mobileLabel: "Kunder",
    path: "/customers",
    icon: Users,
  },
  {
    label: "Tickets",
    mobileLabel: "Tickets",
    path: "/tickets",
    icon: Ticket,
  },
  {
    label: "AI",
    mobileLabel: "AI",
    path: "/ai",
    icon: Sparkles,
  },
];

export function getPageMeta(pathname: string): PageMeta {
  if (pathname.startsWith("/tickets/")) {
    return {
      eyebrow: "CRM",
      title: "Ticketdetaljer",
    };
  }

  const match = primaryNavItems.find((item) => item.path === pathname);
  if (match) {
    return {
      eyebrow: "CRM",
      title: match.label,
    };
  }

  return {
    eyebrow: "CRM",
    title: "CRM",
  };
}
