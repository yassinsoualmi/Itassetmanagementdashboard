import { projectId, publicAnonKey } from '/utils/supabase/info';
import { supabase } from './supabase/client';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b8fa3712`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Get the access token if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken || publicAnonKey}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error (${endpoint}):`, data);
      return { success: false, error: data.error || 'An error occurred' };
    }

    return data;
  } catch (error) {
    console.error(`Network Error (${endpoint}):`, error);
    return { success: false, error: String(error) };
  }
}

// ==========================================
// HELPDESK STAFF API
// ==========================================

export const helpdeskApi = {
  getAll: () => apiRequest<any[]>('/helpdesk'),
  getById: (id: string) => apiRequest<any>(`/helpdesk/${id}`),
  create: (data: any) => apiRequest<any>('/helpdesk', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/helpdesk/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/helpdesk/${id}`, {
    method: 'DELETE',
  }),
};

// ==========================================
// EQUIPMENT API
// ==========================================

export const equipmentApi = {
  getAll: () => apiRequest<any[]>('/equipment'),
  getById: (id: string) => apiRequest<any>(`/equipment/${id}`),
  create: (data: any) => apiRequest<any>('/equipment', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/equipment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/equipment/${id}`, {
    method: 'DELETE',
  }),
};

// ==========================================
// USERS (EMPLOYEES) API
// ==========================================

export const usersApi = {
  getAll: () => apiRequest<any[]>('/users'),
  create: (data: any) => apiRequest<any>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// ==========================================
// PERIPHERAL TYPES API
// ==========================================

export const peripheralsApi = {
  getAll: () => apiRequest<any[]>('/peripherals'),
  create: (data: any) => apiRequest<any>('/peripherals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/peripherals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/peripherals/${id}`, {
    method: 'DELETE',
  }),
};

// ==========================================
// INTERVENTIONS API
// ==========================================

export const interventionsApi = {
  getAll: () => apiRequest<any[]>('/interventions'),
  getById: (id: string) => apiRequest<any>(`/interventions/${id}`),
  create: (data: any) => apiRequest<any>('/interventions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/interventions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/interventions/${id}`, {
    method: 'DELETE',
  }),
};

// ==========================================
// HEALTH CHECK
// ==========================================

export const healthCheck = () => apiRequest<{ status: string }>('/health');