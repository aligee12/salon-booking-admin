"use client";

import { useState, useEffect } from "react";
import { initialBookings, initialServices, initialStaff } from "@/data/mockAdminData";
import { Booking } from "@/types/admin";
import { Calendar, CheckCircle, Clock, Search, XCircle, FileText, ChevronDown } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Load from Backend
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/bookings");
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((b: any) => ({
          id: b.bookingCode || b.id,
          originalId: b.id, // Keep the DB ID for update calls
          customerName: b.customerName,
          customerPhone: b.phone,
          serviceId: b.serviceId,
          staffId: b.staffId,
          date: new Date(b.bookingDate).toISOString().split('T')[0],
          time: new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: b.service?.price || 0,
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase(),
          serviceName: b.service?.name,
          staffName: b.staff?.name
        }));
        setBookings(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: string, originalId: string | undefined, newStatus: Booking['status']) => {
    // Optimistic UI update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

    let action = 'confirm';
    if (newStatus === 'Completed') action = 'complete';
    if (newStatus === 'Cancelled') action = 'cancel';

    try {
      await fetch(`http://localhost:5000/api/bookings/${originalId || id}/${action}`, {
        method: "PATCH"
      });
    } catch (e) {
      console.error(e);
      // Optional: rollback on error
      fetchBookings(); 
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-dark dark:text-white">Bookings Management</h2>
      </div>

      {/* Filters Bar */}
      <div className="rounded-[10px] bg-white p-4 mb-6 shadow-1 dark:bg-[#251F31] dark:shadow-card flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5" size={20} />
          <input
            type="text"
            placeholder="Search by customer name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 outline-none focus:border-primary dark:border-dark-3 dark:focus:border-primary"
          />
        </div>
        <select 
          className="rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none focus:border-primary dark:border-dark-3 dark:focus:border-primary"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        {/* Additional filters can be placed here matching staff, date, and service */}
      </div>

      {/* Table */}
      <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-[#251F31] dark:shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="pb-3 font-semibold text-dark dark:text-white">ID / Customer</th>
                <th className="pb-3 font-semibold text-dark dark:text-white">Service / Staff</th>
                <th className="pb-3 font-semibold text-dark dark:text-white">Date / Time</th>
                <th className="pb-3 font-semibold text-dark dark:text-white">Price</th>
                <th className="pb-3 font-semibold text-dark dark:text-white">Status</th>
                <th className="pb-3 font-semibold text-dark dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => {
                const service = initialServices.find(s => s.id === b.serviceId);
                const staff = initialStaff.find(s => s.id === b.staffId);

                return (
                  <tr key={b.id} className="border-b border-stroke dark:border-dark-3 last:border-0 hover:bg-gray-1 dark:hover:bg-dark-2">
                    <td className="py-4">
                      <div className="font-semibold text-dark dark:text-white">{b.customerName}</div>
                      <div className="text-sm text-dark-5">{b.id} • {b.customerPhone}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-dark dark:text-white">{(b as any).serviceName || service?.name}</div>
                      <div className="text-sm text-dark-5">with {(b as any).staffName || staff?.name}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-dark dark:text-white">{b.date}</div>
                      <div className="text-sm text-dark-5">{b.time}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-dark dark:text-white font-mono">Rs. {b.price}</div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        b.status === 'Completed' ? 'bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-white' :
                        b.status === 'Confirmed' ? 'bg-[#10B981]/10 text-[#10B981]' :
                        b.status === 'Cancelled' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                        'bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {/* Simple fast actions */}
                      <div className="flex items-center justify-end gap-2">
                        {b.status === 'Pending' && (
                          <button onClick={() => updateStatus(b.id, (b as any).originalId, 'Confirmed')} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded" title="Confirm">
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {b.status === 'Confirmed' && (
                          <button onClick={() => updateStatus(b.id, (b as any).originalId, 'Completed')} className="p-1.5 text-primary hover:bg-primary/10 rounded" title="Mark Completed">
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                          <button onClick={() => updateStatus(b.id, (b as any).originalId, 'Cancelled')} className="p-1.5 text-red hover:bg-red/10 rounded" title="Cancel">
                            <XCircle size={18} />
                          </button>
                        )}
                        <button className="p-1.5 text-dark-4 hover:bg-gray-2 dark:hover:bg-dark-3 rounded" title="View Details">
                           <FileText size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="py-6 text-center text-dark-5">No bookings found matching filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
