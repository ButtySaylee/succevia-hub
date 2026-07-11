// Centralized API client for Succevia Hub
// All API calls go through this module for consistency

import { ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}/api${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || `Request failed with status ${res.status}` };
    }

    return { data, count: data.count };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

// ====== Listings ======

export const listingsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/listings/paginate${qs}`);
  },
  getById: (id: string) => request<any>(`/listings/${id}`),
  create: (data: any) =>
    request<any>("/listings/create", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>("/listings/update", { method: "PATCH", body: JSON.stringify({ id, ...data }) }),
  delete: (id: string, sellerWhatsapp: string, sellerPin: string) =>
    request<any>("/listings/seller-delete", {
      method: "DELETE",
      body: JSON.stringify({ listing_id: id, seller_whatsapp: sellerWhatsapp, seller_pin: sellerPin }),
    }),
  markSold: (id: string, sellerWhatsapp: string, sellerPin: string) =>
    request<any>("/listings/seller-sold", {
      method: "PATCH",
      body: JSON.stringify({ id, seller_whatsapp: sellerWhatsapp, seller_pin: sellerPin }),
    }),
  relist: (id: string, sellerWhatsapp: string, sellerPin: string) =>
    request<any>("/listings/seller-relist", {
      method: "POST",
      body: JSON.stringify({ listing_id: id, seller_whatsapp: sellerWhatsapp, seller_pin: sellerPin }),
    }),
  getSellerListings: (whatsapp: string, pin: string) =>
    request<any[]>(`/listings/seller?seller_whatsapp=${encodeURIComponent(whatsapp)}&seller_pin=${encodeURIComponent(pin)}`),
};

// ====== Opportunities ======

export const opportunitiesApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/opportunities/list${qs}`);
  },
  getById: (id: string) => request<any>(`/opportunities/${id}`),
  create: (data: any) =>
    request<any>("/opportunities/create", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>("/opportunities/update", { method: "PATCH", body: JSON.stringify({ id, ...data }) }),
  delete: (id: string) =>
    request<any>("/opportunities/delete", { method: "DELETE", body: JSON.stringify({ id }) }),
  toggleActive: (id: string) =>
    request<any>("/opportunities/toggle-active", { method: "POST", body: JSON.stringify({ id }) }),
};

// ====== Service Requests ======

export const servicesApi = {
  createRequest: (data: any) =>
    request<any>("/services/request", { method: "POST", body: JSON.stringify(data) }),
  listRequests: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/services/requests${qs}`);
  },
  submitQuotation: (data: any) =>
    request<any>("/services/quotation", { method: "POST", body: JSON.stringify(data) }),
};

// ====== Jobs ======

export const jobsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/jobs${qs}`);
  },
  getById: (id: string) => request<any>(`/jobs/${id}`),
};

// ====== Scholarships ======

export const scholarshipsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/scholarships${qs}`);
  },
  getById: (id: string) => request<any>(`/scholarships/${id}`),
};

// ====== Businesses ======

export const businessesApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/businesses${qs}`);
  },
  getById: (id: string) => request<any>(`/businesses/${id}`),
};

// ====== Professionals ======

export const professionalsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/professionals${qs}`);
  },
  getById: (id: string) => request<any>(`/professionals/${id}`),
};

// ====== Search ======

export const searchApi = {
  all: (query: string, params?: Record<string, string>) => {
    const qs = new URLSearchParams({ q: query, ...params }).toString();
    return request<{
      listings: any[];
      jobs: any[];
      services: any[];
      professionals: any[];
      businesses: any[];
    }>(`/search?${qs}`);
  },
};

// ====== Auth ======

export const authApi = {
  adminLogin: (password: string) =>
    request<any>("/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
};