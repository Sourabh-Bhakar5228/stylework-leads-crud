import React from 'react';
import { Briefcase, Download, Plus } from 'lucide-react';
import { getExportCsvUrl } from '../api/leadApi';

interface HeaderProps {
  onOpenCreateModal: () => void;
  totalLeads: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, totalLeads }) => {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-logo">
          <Briefcase size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 className="brand-title">LeadPulse</h1>
            <span className="brand-badge">Stylework Assignment</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Next-Gen Workspace CRM & Lead Pipeline Tracker
          </p>
        </div>
      </div>

      <div className="header-actions">
        {totalLeads > 0 && (
          <a
            href={getExportCsvUrl()}
            className="btn btn-secondary"
            title="Download full lead records in CSV format"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </a>
        )}
        <button
          onClick={onOpenCreateModal}
          className="btn btn-primary"
          id="btn-create-lead"
        >
          <Plus size={18} />
          <span>Add Lead</span>
        </button>
      </div>
    </header>
  );
};
