import { initialDashboardMetrics } from "@/data/mockAdminData";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export function OverviewCardsGroup() {
  const metrics = initialDashboardMetrics;

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Today's Bookings"
        data={{
          value: metrics.todaysBookings,
          growthRate: metrics.todaysBookingsTrend,
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total Bookings This Week"
        data={{
          value: metrics.weeklyBookings,
          growthRate: metrics.weeklyBookingsTrend,
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Revenue Estimate"
        data={{
          value: "Rs. " + metrics.revenueEstimate.toLocaleString(),
          growthRate: metrics.revenueTrend,
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Pending Confirmations"
        data={{
          value: metrics.pendingConfirmations,
          growthRate: metrics.pendingTrend,
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
