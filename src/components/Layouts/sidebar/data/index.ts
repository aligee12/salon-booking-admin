import * as Icons from "../icons";

type SubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url?: string;
  items: SubItem[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_DATA: NavSection[] = [
  {
    label: "SALON CONTROL CENTER",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/admin/dashboard",
        items: [],
      },
      {
        title: "Bookings",
        icon: Icons.Calendar,
        url: "/admin/bookings",
        items: [],
      },
      {
        title: "Services",
        url: "/admin/services",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Staff",
        url: "/admin/staff",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Availability",
        url: "/admin/availability",
        icon: Icons.Calendar,
        items: [],
      },
    ],
  },
  {
    label: "REPORTS & SETTINGS",
    items: [
      {
        title: "Analytics",
        icon: Icons.PieChart,
        url: "/admin/analytics",
        items: [],
      },
      {
        title: "Settings",
        icon: Icons.Alphabet,
        url: "/admin/settings",
        items: [],
      },
    ],
  },
];
