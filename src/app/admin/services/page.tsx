"use client";

import { useState, useEffect, useCallback } from "react";
import { Edit, Plus, Trash2, RefreshCw, Loader2, AlertCircle, X } from "lucide-react";
import { servicesApi, ApiService, CreateServicePayload } from "@/lib/apiClient";
import toast, { Toaster } from "react-hot-toast";

// ── Service Form Modal ────────────────────────────────────────────────────────

const CATEGORIES = ["Hair", "Skin", "Body", "Nail", "Wellness", "Other"];

type FormState = {
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
};

const emptyForm: FormState = {
  name: "",
  category: "Hair",
  description: "",
  duration: "30",
  price: "",
};

interface ServiceModalProps {
  service: ApiService | null; // null = create mode
  onClose: () => void;
  onSaved: (s: ApiService) => void;
}

function ServiceModal({ service, onClose, onSaved }: ServiceModalProps) {
  const [form, setForm] = useState<FormState>(
    service
      ? {
          name: service.name,
          category: service.category,
          description: service.description,
          duration: String(service.duration),
          price: String(service.price),
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.price.trim()) {
      setError("Name and price are required.");
      return;
    }

    const payload: CreateServicePayload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      duration: parseInt(form.duration),
      price: parseFloat(form.price),
    };

    setSaving(true);
    try {
      const saved = service
        ? await servicesApi.update(service.id, payload)
        : await servicesApi.create(payload);
      onSaved(saved);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#251F31] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke dark:border-dark-3 px-6 py-4">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            {service ? "Edit Service" : "Add New Service"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-2 dark:hover:bg-dark-2 text-dark-5">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red/10 px-4 py-3 text-sm text-red">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                Service Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                placeholder="e.g. Haircut & Styling"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                Category *
              </label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-[#251F31] dark:text-white dark:focus:border-primary"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                Duration (minutes) *
              </label>
              <input
                type="number"
                min={5}
                step={5}
                value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                Price (Rs.) *
              </label>
              <input
                type="number"
                min={0}
                step={50}
                value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                placeholder="0"
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary resize-none"
                placeholder="Brief description of the service..."
              />
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
              {service ? "Save Changes" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────

interface DeleteDialogProps {
  service: ApiService;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

function DeleteDialog({ service, onClose, onDeleted }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await servicesApi.delete(service.id);
      onDeleted(service.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#251F31] shadow-2xl p-6">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-2">Delete Service</h3>
        <p className="text-sm text-dark-5 mb-4">
          Are you sure you want to delete <span className="font-semibold text-dark dark:text-white">{service.name}</span>?
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalService, setModalService] = useState<ApiService | null | undefined>(undefined); // undefined=closed, null=create, ApiService=edit
  const [deleteTarget, setDeleteTarget] = useState<ApiService | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleToggleStatus = async (service: ApiService) => {
    setTogglingId(service.id);
    try {
      const updated = await servicesApi.toggleStatus(service.id);
      setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
      toast.success(`${updated.name} is now ${updated.isActive ? "Active" : "Inactive"}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleSaved = (saved: ApiService) => {
    setServices(prev => {
      const idx = prev.findIndex(s => s.id === saved.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    toast.success(modalService ? "Service updated!" : "Service created!");
    setModalService(undefined);
  };

  const handleDeleted = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    toast.success("Service deleted");
    setDeleteTarget(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      {modalService !== undefined && (
        <ServiceModal
          service={modalService}
          onClose={() => setModalService(undefined)}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          service={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}

      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-title-md2 font-bold text-dark dark:text-white">Services Management</h2>
            <p className="text-sm text-dark-5 mt-0.5">{services.length} service{services.length !== 1 ? "s" : ""} configured</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchServices}
              disabled={loading}
              title="Refresh"
              className="p-2.5 rounded-lg border border-stroke text-dark-4 hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setModalService(null)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              <Plus size={20} /> Add Service
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-[#251F31] dark:shadow-card">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-dark-5">
              <Loader2 size={32} className="animate-spin text-primary" />
              <span className="text-sm">Loading services...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-red">
              <AlertCircle size={32} />
              <span className="text-sm font-medium">{error}</span>
              <button onClick={fetchServices} className="text-sm text-primary underline">Try again</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3">
                    <th className="pb-3 font-semibold text-dark dark:text-white">Name / Description</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white">Category</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white">Duration</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white">Price</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white">Status</th>
                    <th className="pb-3 font-semibold text-dark dark:text-white text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id} className="border-b border-stroke dark:border-dark-3 last:border-0 hover:bg-gray-1 dark:hover:bg-dark-2 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-dark dark:text-white">{s.name}</div>
                        <div className="text-sm text-dark-5 line-clamp-1">{s.description || "—"}</div>
                      </td>
                      <td className="py-4">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-4 text-dark-4 dark:text-gray-4">{s.duration} min</td>
                      <td className="py-4 font-mono font-medium text-dark dark:text-white">Rs. {s.price.toLocaleString()}</td>
                      <td className="py-4">
                        <button
                          onClick={() => handleToggleStatus(s)}
                          disabled={togglingId === s.id}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                            s.isActive
                              ? "bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20"
                              : "bg-gray-2 text-dark-5 hover:bg-gray-3 dark:bg-dark-3 dark:text-gray-3 dark:hover:bg-dark-2"
                          }`}
                        >
                          {togglingId === s.id && <Loader2 size={12} className="animate-spin" />}
                          {s.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalService(s)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit Service"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(s)}
                            className="p-1.5 text-red hover:bg-red/10 rounded-lg transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {services.length === 0 && (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-3">✂️</div>
                  <p className="text-dark-5 font-medium">No services configured yet.</p>
                  <button onClick={() => setModalService(null)} className="mt-3 text-sm text-primary underline">
                    Add your first service
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
