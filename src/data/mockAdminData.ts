import { Booking, BookingAnalytics, DashboardMetrics, Service, Staff } from "@/types/admin";
import dayjs from "dayjs";

export const initialDashboardMetrics: DashboardMetrics = {
  todaysBookings: 18,
  todaysBookingsTrend: 12,
  weeklyBookings: 96,
  weeklyBookingsTrend: 8,
  revenueEstimate: 128000,
  revenueTrend: 15,
  pendingConfirmations: 6,
  pendingTrend: -2,
};

export const initialServices: Service[] = [
  { id: "srv_1", name: "Haircut", category: "Hair", duration: 30, price: 1500, status: "Active", description: "Professional haircut and styling" },
  { id: "srv_2", name: "Facial", category: "Skin", duration: 60, price: 3500, status: "Active", description: "Deep cleansing facial with massage" },
  { id: "srv_3", name: "Beard Trim", category: "Hair", duration: 20, price: 800, status: "Active", description: "Classic beard trim and styling" },
  { id: "srv_4", name: "Hair Color", category: "Hair", duration: 120, price: 5000, status: "Active", description: "Full hair coloring service" },
  { id: "srv_5", name: "Massage Therapy", category: "Body", duration: 60, price: 4000, status: "Active", description: "Full body relaxing massage" },
];

export const initialStaff: Staff[] = [
  { id: "stf_1", name: "Sara", role: "Stylist", phone: "03001234567", workingStartTime: "10:00", workingEndTime: "18:00", assignedServices: ["Haircut", "Hair Color"], status: "Active" },
  { id: "stf_2", name: "Ahmed", role: "Barber", phone: "03009876543", workingStartTime: "09:00", workingEndTime: "17:00", assignedServices: ["Haircut", "Beard Trim"], status: "Active" },
  { id: "stf_3", name: "Fatima", role: "Therapist", phone: "03211112222", workingStartTime: "11:00", workingEndTime: "19:00", assignedServices: ["Facial", "Massage Therapy"], status: "Active" },
];

export const today = dayjs().format("YYYY-MM-DD");

export const initialBookings: Booking[] = [
  {
    id: "BK-2026-0001",
    customerName: "Ali",
    customerPhone: "03001234567",
    serviceId: "srv_1",
    staffId: "stf_1",
    date: today,
    time: "11:00",
    price: 1500,
    status: "Pending",
    history: [
      { timestamp: "2026-04-18T10:00:00", status: "Pending", note: "Booking created" }
    ]
  },
  {
    id: "BK-2026-0002",
    customerName: "Omar",
    customerPhone: "03219998888",
    serviceId: "srv_3",
    staffId: "stf_2",
    date: today,
    time: "14:30",
    price: 800,
    status: "Confirmed",
    history: [
      { timestamp: "2026-04-17T15:00:00", status: "Pending", note: "Booking created" },
      { timestamp: "2026-04-18T09:00:00", status: "Confirmed", note: "Booking confirmed by admin" }
    ]
  },
  {
    id: "BK-2026-0003",
    customerName: "Ayesha",
    customerPhone: "03334445555",
    serviceId: "srv_5",
    staffId: "stf_3",
    date: today,
    time: "16:00",
    price: 4000,
    status: "Completed",
    history: [
      { timestamp: "2026-04-16T12:00:00", status: "Pending", note: "Booking created" },
      { timestamp: "2026-04-17T10:00:00", status: "Confirmed", note: "Booking confirmed by admin" },
      { timestamp: "2026-04-18T17:05:00", status: "Completed", note: "Service completed" }
    ]
  },
  {
    id: "BK-2026-0004",
    customerName: "Zainab",
    customerPhone: "03112223333",
    serviceId: "srv_2",
    staffId: "stf_3",
    date: dayjs().add(1, 'day').format("YYYY-MM-DD"),
    time: "12:00",
    price: 3500,
    status: "Cancelled",
    history: [
      { timestamp: "2026-04-17T11:00:00", status: "Pending", note: "Booking created" },
      { timestamp: "2026-04-18T10:30:00", status: "Cancelled", note: "Cancelled by customer request" }
    ]
  }
];

export const mockAnalytics: BookingAnalytics = {
  popularServices: [
    { name: "Haircut", percentage: 40 },
    { name: "Facial", percentage: 25 },
    { name: "Massage", percentage: 20 },
    { name: "Hair Color", percentage: 10 },
    { name: "Beard Trim", percentage: 5 },
  ],
  peakHours: [
    { hour: "10 AM", count: 8 },
    { hour: "12 PM", count: 12 },
    { hour: "2 PM", count: 15 },
    { hour: "4 PM", count: 20 },
    { hour: "6 PM", count: 18 },
    { hour: "8 PM", count: 7 },
  ],
  revenueTrend: [
    { date: "Mon", amount: 15000 },
    { date: "Tue", amount: 18000 },
    { date: "Wed", amount: 14000 },
    { date: "Thu", amount: 22000 },
    { date: "Fri", amount: 28000 },
    { date: "Sat", amount: 35000 },
    { date: "Sun", amount: 30000 },
  ],
  completionRate: 87
};
