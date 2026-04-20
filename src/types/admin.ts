export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
export type ServiceStatus = "Active" | "Inactive";
export type StaffStatus = "Active" | "Inactive" | "On Leave";

export interface DashboardMetrics {
  todaysBookings: number;
  todaysBookingsTrend: number; // percentage
  weeklyBookings: number;
  weeklyBookingsTrend: number;
  revenueEstimate: number;
  revenueTrend: number;
  pendingConfirmations: number;
  pendingTrend: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number; // in minutes
  price: number;
  status: ServiceStatus;
  description: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  workingStartTime: string; // HH:mm
  workingEndTime: string; // HH:mm
  assignedServices: string[]; // array of service names
  status: StaffStatus;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string; // relates to Service
  staffId: string; // relates to Staff
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  status: BookingStatus;
  notes?: string;
  history?: BookingHistoryEvent[];
}

export interface BookingHistoryEvent {
  timestamp: string;
  status: BookingStatus;
  note: string;
}

export interface BookingAnalytics {
  popularServices: { name: string; percentage: number }[];
  peakHours: { hour: string; count: number }[];
  revenueTrend: { date: string; amount: number }[];
  completionRate: number; // percentage
}
