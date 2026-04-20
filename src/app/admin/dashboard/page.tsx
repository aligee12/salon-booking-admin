import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { initialBookings, initialStaff, initialServices } from "@/data/mockAdminData";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-7"
        />

        <WeeksProfit
          className="col-span-12 xl:col-span-5"
        />

        {/* Recent Bookings Widget */}
        <div className="col-span-12 xl:col-span-12 grid grid-cols-1 gap-4">
          <div className="rounded-[10px] border border-primary-faint bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:border-primary/20 dark:bg-[#251F31] dark:shadow-card">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-body-2xlg font-bold text-dark dark:text-white">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-primary hover:underline">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left bg-white dark:bg-[#251F31]">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3">
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Staff</th>
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {initialBookings.slice(0, 5).map(b => {
                    const service = initialServices.find(s => s.id === b.serviceId);
                    const staff = initialStaff.find(s => s.id === b.staffId);
                    
                    return (
                      <tr key={b.id} className="border-b border-stroke dark:border-dark-3">
                        <td className="py-4">
                          <div className="font-semibold text-dark dark:text-white">{b.customerName}</div>
                          <div className="text-sm text-dark-5">{b.customerPhone}</div>
                        </td>
                        <td className="py-4">{service?.name}</td>
                        <td className="py-4">{staff?.name}</td>
                        <td className="py-4">
                          <div className="font-medium">{b.date}</div>
                          <div className="text-sm">{b.time}</div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                            b.status === 'Completed' ? 'bg-gray-2 text-dark-5' :
                            b.status === 'Confirmed' ? 'bg-[#10B981]/10 text-[#10B981]' :
                            b.status === 'Cancelled' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                            'bg-[#F59E0B]/10 text-[#F59E0B]'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
