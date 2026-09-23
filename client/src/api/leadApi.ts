import { Lead, LeadFormData, LeadStats, LeadStatus, PaginationMeta } from '../types';

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${BASE_URL}/api/leads`;

interface FetchLeadsParams {
  search?: string;
  status?: LeadStatus | 'All';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface LeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: PaginationMeta;
}

export async function fetchLeads(params: FetchLeadsParams): Promise<LeadsResponse> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());

  const response = await fetch(`${API_BASE}?${query.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch leads');
  }
  return response.json();
}

export async function fetchLeadStats(): Promise<LeadStats> {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch lead statistics');
  }
  const result = await response.json();
  return result.data;
}

export async function createLead(data: LeadFormData): Promise<Lead> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) {
    const errorMsg = result.errors
      ? result.errors.map((e: { field: string; message: string }) => e.message).join(', ')
      : result.message || 'Failed to create lead';
    throw new Error(errorMsg);
  }
  return result.data;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  const response = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update lead status');
  }
  return result.data;
}

export async function updateLead(id: string, data: Partial<LeadFormData>): Promise<Lead> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) {
    const errorMsg = result.errors
      ? result.errors.map((e: { field: string; message: string }) => e.message).join(', ')
      : result.message || 'Failed to update lead';
    throw new Error(errorMsg);
  }
  return result.data;
}

export async function deleteLead(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || 'Failed to delete lead');
  }
}

export function getExportCsvUrl(): string {
  return `${API_BASE}/export/csv`;
}
