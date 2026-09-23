export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'In Progress',
  'Qualified',
  'Closed - Won',
  'Closed - Lost'
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  notes?: string;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  conversionRate: number;
  last7DaysCount: number;
}

export interface FilterOptions {
  search: string;
  status: LeadStatus | 'All';
  sortBy: 'createdAt' | 'name' | 'status' | 'email';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
