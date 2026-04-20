"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Edit, Plus, Trash2, RefreshCw, Loader2, AlertCircle, X, UserCog,
} from "lucide-react";
import { staffApi, servicesApi, ApiStaff, ApiService, CreateStaffPayload } from "@/lib/apiClient";
import toast, { Toaster } from "react-hot-toast";

// ── Staff Form Modal ──────────────────────────────────────────────────────────

type StaffFormState = {
  name: string;
  role: string;
  phone: string;
  workingStartTime: string;
  workingEndTime: string;
  serviceIds: string[];
};

const emptyStaffForm: StaffFormState = {
  name: "",
  role: "",
  phone: "",
  workingStartTime: "09:00",
  workingEndTime: "18:00",
  serviceIds: [],
};

interface StaffModalProps {
  staff: ApiStaff | null;
  services: ApiService[];
  onClose: () => void;
  onSaved: (s: ApiStaff) => void;
}

function StaffModal({ staff, services, onClose, onSaved }: StaffModalProps) {
  const getDefaultStartTime = (s: ApiStaff | null) => {
    if (!s) return "09:00";
    const mon = s.schedules.find(sc => sc.dayOfWeek === 1);
    return mon?.startTime || "09:00";
  };
  const getDefaultEndTime = (s: ApiStaff | null) => {
    if (!s) return "18:00";
    const mon = s.schedules.find(sc => sc.dayOfWeek === 1);
    return mon?.endTime || "18:00";
  };

  const [form, setForm] = useState<StaffFormState>(
    staff
      ? {
          name: staff.name,
          role: staff.role,
          phone: staff.phone,
          workingStartTime: getDefaultStartTime(staff),
          workingEndTime: getDefaultEndTime(staff),
          serviceIds: staff.assignedServiceIds,
        }
      : emptyStaffForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleService = (id: string) => {
    setForm(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter(s => s !== id)
        : [...prev.serviceIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.role.trim()) {
      setError("Name and role are required.");
      return;
    }

    const payload: CreateStaffPayload = {
      name: form.name.trim(),
      role: form.role.trim(),
      phone: form.phone.trim(),
      serviceIds: form.serviceIds,
      workingStartTime: form.workingStartTime,
      workingEndTime: form.workingEndTime,
    };

    setSaving(true);
    try {
      const saved = staff
        ? await staffApi.update(staff.id, payload)
        : await staffApi.create(payload);
      onSaved(saved);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save staff member");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#251F31] shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke dark:border-dark-3 px-6 py-4 flex-shrink-0">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            {staff ? "Edit Staff Member" : "Add Staff Member"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-2 dark:hover:bg-dark-2 text-dark-5">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red/10 px-4 py-3 text-sm text-red">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                placeholder="e.g. Sara Khan"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Role *</label>
              <input
                type="text"
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                placeholder="e.g. Stylist"
                required
              />
            </div>

            {/* Phone */}
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                placeholder="e.g. 03001234567"
              />
            </div>

            {/* Working Hours */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Start Time</label>
              <input
                type="time"
                value={form.workingStartTime}
                onChange={e => setForm(p => ({ ...p, workingStartTime: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">End Time</label>
              <input
                type="time"
                value={form.workingEndTime}
                onChange={e => setForm(p => ({ ...p, workingEndTime: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Assigned Services */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Assigned Services
              </label>
              {services.length === 0 ? (
                <p className="text-sm text-dark-5">No services available. Create services first.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {services.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleService(s.id)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        form.serviceIds.includes(s.id)
                          ? "border-primary bg-primary text-white"
                          : "border-stroke bg-transparent text-dark-5 hover:border-primary hover:text-primary dark:border-dark-3 dark:text-gray-3"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {staff ? "Save Changes" : "Add Staff Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────

interface StaffDeleteDialogProps {
  staff: ApiStaff;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

function StaffDeleteDialog({ staff, onClose, onDeleted }: StaffDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await staffApi.delete(staff.id);
      onDeleted(staff.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#251F31] shadow-2xl p-6">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-2">Remove Staff Member</h3>
        <p className="text-sm text-dark-5 mb-4">
          Are you sure you want to remove <span className="font-semibold text-dark dark:text-white">{staff.name}</span>?
          This action cannot be undone.
        </p>
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red/10 px-4 py-3 text-sm text-red mb-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
          >
            {deleting && <Loader2 size={16} className="animate-spin" />}
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active:   { label: "Active",   cls: "bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20" },
  inactive: { label: "Inactive", cls: "bg-gray-2 text-dark-5 hover:bg-gray-3 dark:bg-dark-3 dark:text-gray-3 dark:hover:bg-dark-2" },
};

export default function StaffPage() {
  const [staffList, setStaffList] = useState<ApiStaff[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalStaff, setModalStaff] = useState<ApiStaff | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<ApiStaff | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [staffData, servicesData] = await Promise.all([
        staffApi.getAll(),
        servicesApi.getAll(),
      ]);
      setStaffList(staffData);
      setServices(servicesData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggleStatus = async (st: ApiStaff) => {
    setTogglingId(st.id);
    try {
      const updated = await staffApi.toggleStatus(st.id);
      setStaffList(prev => prev.map(s => s.id === updated.id ? { ...s, isActive: updated.isActive } : s));
      toast.success(`${st.name} is now ${updated.isActive ? "Active" : "Inactive"}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleSaved = (saved: ApiStaff) => {
    setStaffList(prev => {
      const idx = prev.findIndex(s => s.id === saved.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    toast.success(modalStaff ? "Staff updated!" : "Staff member added!");
    setModalStaff(undefined);
  };

  const handleDeleted = (id: string) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
    toast.success("Staff member removed");
    setDeleteTarget(null);
  };

  const getWorkingHours = (st: ApiStaff) => {
    const mon = st.schedules.find(sc => sc.dayOfWeek === 1);
    if (!mon) return "—";
    return `${mon.startTime} – ${mon.endTime}`;
  };

  return (
    <>
      <Toaster position="top-right" />
      {modalStaff !== undefined && (
        <StaffModal
          staff={modalStaff}
          services={services}
          onClose={() => setModalStaff(undefined)}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <StaffDeleteDialog
          staff={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-title-md2 font-bold text-dark dark:text-white">Staff Management</h2>
            <p className="text-sm text-dark-5 mt-0.5">{staffList.length} staff member{staffList.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              title="Refresh"
              className="p-2.5 rounded-lg border border-stroke text-dark-4 hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setModalStaff(null)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              <Plus size={20} /> Add Staff Member
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-[#251F31] dark:shadow-card">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-dark-5">
              <Loader2 size={32} className="animate-spin text-primary" />
              <span className="text-sm">Loading staff...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-red">
              <AlertCircle size={32} />
              <span className="text-sm font-medium">{error}</span>
              <button onClick={fetchData} className="text-sm text-primary underline">Try again</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3">
                    <th className="pb-3 font-semibold text-dark dark:text-white">Name / Role</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white">Phone</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white">Working Hours</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white">Services</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white">Status</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(st => {
                    const statusCfg = st.isActive ? STATUS_CONFIG.active : STATUS_CONFIG.inactive;
                    return (
                      <tr key={st.id} className="border-b border-stroke dark:border-dark-3 last:border-0 hover:bg-gray-1 dark:hover:bg-dark-2 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                              <UserCog size={20} />
                            </div>
                            <div>
                              <div className="font-semibold text-dark dark:text-white">{st.name}</div>
                              <div className="text-sm font-medium text-primary">{st.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-dark-5 dark:text-gray-4">{st.phone || "—"}</td>
                        <td className="py-4 font-mono text-sm text-dark-4 dark:text-gray-4">{getWorkingHours(st)}</td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {st.assignedServices.length > 0 ? (
                              st.assignedServices.map(srv => (
                                <span key={srv} className="rounded bg-gray-2 px-2 py-0.5 text-xs font-medium text-dark-6 dark:bg-dark-3 dark:text-gray-3">
                                  {srv}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-dark-5">No services</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleToggleStatus(st)}
                            disabled={togglingId === st.id}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors ${statusCfg.cls}`}
                          >
                            {togglingId === st.id && <Loader2 size={12} className="animate-spin" />}
                            {statusCfg.label}
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setModalStaff(st)}
                              className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Edit Staff"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(st)}
                              className="p-1.5 text-red hover:bg-red/10 rounded-lg transition-colors"
                              title="Remove Staff"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {staffList.length === 0 && (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-3">👩‍💼</div>
                  <p className="text-dark-5 font-medium">No staff members added yet.</p>
                  <button onClick={() => setModalStaff(null)} className="mt-3 text-sm text-primary underline">
                    Add your first staff member
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
