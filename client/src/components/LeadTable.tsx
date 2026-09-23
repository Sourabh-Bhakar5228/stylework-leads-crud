import React from 'react';
import { Mail, Phone, Calendar, Edit2, Trash2, UserPlus } from 'lucide-react';
import { Lead, LEAD_STATUSES, LeadStatus } from '../types';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onOpenCreateModal: () => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  onUpdateStatus,
  onEditLead,
  onDeleteLead,
  onOpenCreateModal
}) => {
  const getBadgeClass = (status: LeadStatus) => {
    const slug = status.toLowerCase().replace(/\s+/g, '-');
    return `badge badge-${slug}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!loading && leads.length === 0) {
    return (
      <div className="table-card empty-state">
        <div className="empty-state-icon">
          <UserPlus size={56} />
        </div>
        <div className="empty-state-title">No leads match your criteria</div>
        <p style={{ marginBottom: '1.25rem' }}>
          Try clearing your search query or add a new lead to populate the pipeline.
        </p>
        <button onClick={onOpenCreateModal} className="btn btn-primary">
          <UserPlus size={16} />
          <span>Create New Lead</span>
        </button>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead Name & Info</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                {/* Lead Name with Avatar */}
                <td>
                  <div className="lead-name-cell">
                    <div className="lead-avatar">{getInitials(lead.name)}</div>
                    <div>
                      <div className="lead-name">{lead.name}</div>
                      {lead.notes && (
                        <div className="lead-notes" title={lead.notes}>
                          {lead.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                    <a
                      href={`mailto:${lead.email}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = 'underline')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = 'none')}
                    >
                      {lead.email}
                    </a>
                  </div>
                </td>

                {/* Phone */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                    <a
                      href={`tel:${lead.phone}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = 'underline')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = 'none')}
                    >
                      {lead.phone}
                    </a>
                  </div>
                </td>

                {/* Inline Status Dropdown */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={getBadgeClass(lead.status)}>
                      <span className="badge-dot" />
                      {lead.status}
                    </span>
                    <select
                      className="status-select"
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead._id, e.target.value as LeadStatus)}
                      title="Quick update status"
                    >
                      {LEAD_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>

                {/* Created At */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    <Calendar size={14} />
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                </td>

                {/* Actions */}
                <td>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onEditLead(lead)}
                      className="icon-btn"
                      title="Edit lead details"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteLead(lead)}
                      className="icon-btn icon-btn-danger"
                      title="Delete lead"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
