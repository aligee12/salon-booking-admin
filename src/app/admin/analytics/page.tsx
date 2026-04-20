
export const dynamic = "force-dynamic";

import { mockAnalytics } from "@/data/mockAdminData";
import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-dark dark:text-white">Business Analytics</h2>
      </div>

      <div className="grid gap-4 md:gap-6 2xl:gap-7.5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {/* Completion Rate Card */}
        <div className="rounded-[10px] border border-primary-faint bg-white p-6 shadow-1 dark:bg-[#251F31] md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark dark:text-white">Completion Rate</h3>
            <span className="text-sm font-medium text-green-500">Target: 85%</span>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-dark-5">All time bookings</span>
              <span className="text-sm font-bold text-dark dark:text-white">{mockAnalytics.completionRate}%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-gray-2 dark:bg-dark-3">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${mockAnalytics.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Most popular services simple mock */}
        <div className="rounded-[10px] border border-primary-faint bg-white p-6 shadow-1 dark:bg-[#251F31] md:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-bold text-dark dark:text-white mb-4">Most Popular Services</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {mockAnalytics.popularServices.map(s => (
              <div key={s.name} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-1 dark:bg-[#2C2539]">
                <span className="font-bold text-xl text-dark dark:text-white mb-1">{s.percentage}%</span>
                <span className="text-sm text-dark-5 text-center">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <PaymentsOverview className="col-span-12 xl:col-span-7" />
        <WeeksProfit className="col-span-12 xl:col-span-5" />
      </div>
    </div>
  );
}
