import React from 'react';
import { Mail, Phone, Calendar, Trash2, Edit2 } from 'lucide-react';
import { Lead, LEAD_STATUSES, LeadStatus } from '../types';

interface LeadKanbanProps {
  leads: Lead[];
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
}

export const LeadKanban: React.FC<LeadKanbanProps> = ({
  leads,
  onUpdateStatus,
  onEditLead,
  onDeleteLead
}) => {
  const getBadgeClass = (status: LeadStatus) => {
    const slug = status.toLowerCase().replace(/\s+/g, '-');
    return `badge badge-${slug}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="kanban-board">
      {LEAD_STATUSES.map((colStatus) => {
        const colLeads = leads.filter((l) => l.status === colStatus);

        return (
          <div key={colStatus} className="kanban-column">
            <div className="kanban-col-header">
              <div className="kanban-col-title">
                <span className={getBadgeClass(colStatus)}>
                  <span className="badge-dot" />
                  {colStatus}
                </span>
              </div>
              <span className="kanban-count-pill">{colLeads.length}</span>
            </div>

            <div className="kanban-cards-container">
              {colLeads.length === 0 ? (
                <div
                  style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.8125rem',
                    border: '1px dashed rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px'
                  }}
                >
                  No leads in {colStatus}
                </div>
              ) : (
                colLeads.map((lead) => (
                  <div key={lead._id} className="kanban-card">
                    <div className="kanban-card-header">
                      <span className="kanban-card-name">{lead.name}</span>
                      <div className="action-buttons">
                        <button
                          onClick={() => onEditLead(lead)}
                          className="icon-btn"
                          style={{ padding: '0.2rem' }}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteLead(lead)}
                          className="icon-btn icon-btn-danger"
                          style={{ padding: '0.2rem' }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="kanban-meta-item">
                      <Mail size={13} style={{ flexShrink: 0 }} />
                      <span>{lead.email}</span>
                    </div>

                    <div className="kanban-meta-item">
                      <Phone size={13} style={{ flexShrink: 0 }} />
                      <span>{lead.phone}</span>
                    </div>

                    {lead.notes && (
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          background: 'rgba(0, 0, 0, 0.2)',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          borderLeft: '2px solid var(--accent-primary)'
                        }}
                      >
                        {lead.notes}
                      </div>
                    )}

                    <div className="kanban-card-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Calendar size={12} />
                        <span>{formatDate(lead.createdAt)}</span>
                      </div>

                      <select
                        className="status-select"
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead._id, e.target.value as LeadStatus)}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                      >
                        {LEAD_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            Move to {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
