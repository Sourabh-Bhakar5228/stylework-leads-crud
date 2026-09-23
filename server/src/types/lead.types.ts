export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'In Progress',
  'Qualified',
  'Closed - Won',
  'Closed - Lost'
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface ILead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface LeadFilterQuery {
  search?: string;
  status?: LeadStatus | 'All';
  sortBy?: 'createdAt' | 'name' | 'status' | 'email';
  sortOrder?: 'asc' | 'desc';
  page?: string | number;
  limit?: string | number;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  conversionRate: number; // Won / Total percentage
  last7DaysCount: number;
}

export interface PaginatedLeadsResponse {
  success: boolean;
  data: ILead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}
