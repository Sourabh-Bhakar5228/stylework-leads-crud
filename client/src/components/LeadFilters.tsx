import React from 'react';
import { Search, X, LayoutGrid, Table as TableIcon, ArrowUpDown } from 'lucide-react';
import { LEAD_STATUSES, LeadStatus } from '../types';

interface LeadFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: LeadStatus | 'All';
  onStatusChange: (status: LeadStatus | 'All') => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'createdAt' | 'name' | 'status' | 'email', sortOrder: 'asc' | 'desc') => void;
  viewMode: 'table' | 'kanban';
  onViewModeChange: (mode: 'table' | 'kanban') => void;
  statusCounts?: Record<string, number>;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  statusCounts
}) => {
  const allStatuses: (LeadStatus | 'All')[] = ['All', ...LEAD_STATUSES];

  return (
    <div className="toolbar-card">
      <div className="toolbar-top">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search leads by name, email, or phone..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            id="input-search-leads"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="search-clear"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="view-controls">
          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="status-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-') as [any, 'asc' | 'desc'];
                onSortChange(sb, so);
              }}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.8125rem' }}
              title="Sort order"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="status-asc">Status</option>
            </select>
          </div>

          {/* View Mode Toggle: Table vs Kanban */}
          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
              id="btn-view-table"
            >
              <TableIcon size={16} />
              <span>Table</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => onViewModeChange('kanban')}
              title="Kanban Board View"
              id="btn-view-kanban"
            >
              <LayoutGrid size={16} />
              <span>Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="status-pills-row">
        {allStatuses.map((st) => {
          const isActive = selectedStatus === st;
          const count = st === 'All' ? undefined : statusCounts?.[st];

          return (
            <button
              key={st}
              className={`status-pill ${isActive ? 'active' : ''}`}
              onClick={() => onStatusChange(st)}
            >
              <span>{st}</span>
              {typeof count === 'number' && (
                <span style={{ opacity: 0.75, fontSize: '0.7rem' }}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
