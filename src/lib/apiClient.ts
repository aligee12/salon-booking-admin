const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Services ────────────────────────────────────────────────────────────────

export interface ApiService {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateServicePayload = Pick<ApiService, 'name' | 'category' | 'description' | 'duration' | 'price'>;
export type UpdateServicePayload = Partial<CreateServicePayload & { isActive: boolean }>;

export const servicesApi = {
  getAll: () => request<ApiService[]>('/services'),
  getById: (id: string) => request<ApiService>(`/services/${id}`),
  create: (data: CreateServicePayload) =>
    request<ApiService>('/services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateServicePayload) =>
    request<ApiService>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleStatus: (id: string) =>
    request<ApiService>(`/services/${id}/toggle-status`, { method: 'PATCH' }),
  delete: (id: string) =>
    request<{ message: string }>(`/services/${id}`, { method: 'DELETE' }),
};

// ─── Staff ───────────────────────────────────────────────────────────────────

export interface ApiStaffSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ApiStaff {
  id: string;
  name: string;
  role: string;
  phone: string;
  isActive: boolean;
  assignedServices: string[];
  assignedServiceIds: string[];
  schedules: ApiStaffSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  name: string;
  role: string;
  phone?: string;
  serviceIds?: string[];
  workingStartTime?: string;
  workingEndTime?: string;
}

export type UpdateStaffPayload = Partial<CreateStaffPayload & { isActive: boolean }>;

// Raw shape returned by Prisma before mapping (create/update/toggleStatus)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawStaff = Record<string, any>;

/**
 * Normalizes a raw Prisma staff record into ApiStaff.
 * Handles both the already-mapped shape (from getAll) and the raw Prisma
 * shape (from create / update / toggleStatus) which has a nested `services`
 * array instead of flat `assignedServices` / `assignedServiceIds`.
 */
function normalizeStaff(raw: RawStaff): ApiStaff {
  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    phone: raw.phone ?? '',
    isActive: raw.isActive,
    // Already mapped → use as-is; raw Prisma → derive from nested services
    assignedServices: Array.isArray(raw.assignedServices)
      ? raw.assignedServices
      : (raw.services ?? []).map((ss: RawStaff) => ss.service?.name ?? ''),
    assignedServiceIds: Array.isArray(raw.assignedServiceIds)
      ? raw.assignedServiceIds
      : (raw.services ?? []).map((ss: RawStaff) => ss.serviceId ?? ''),
    schedules: Array.isArray(raw.schedules) ? raw.schedules : [],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export const staffApi = {
  getAll: () => request<ApiStaff[]>('/staff'),
  getById: (id: string) => request<ApiStaff>(`/staff/${id}`),
  create: (data: CreateStaffPayload) =>
    request<RawStaff>('/staff', { method: 'POST', body: JSON.stringify(data) })
      .then(normalizeStaff),
  update: (id: string, data: UpdateStaffPayload) =>
    request<RawStaff>(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) })
      .then(normalizeStaff),
  toggleStatus: (id: string) =>
    request<RawStaff>(`/staff/${id}/toggle-status`, { method: 'PATCH' })
      .then(normalizeStaff),
  delete: (id: string) =>
    request<{ message: string }>(`/staff/${id}`, { method: 'DELETE' }),
};
