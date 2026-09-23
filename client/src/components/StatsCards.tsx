import React from 'react';
import { Users, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { LeadStats } from '../types';

interface StatsCardsProps {
  stats: LeadStats | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  const total = stats?.total ?? 0;
  const newLeads = stats?.byStatus?.['New'] ?? 0;
  const inProgress = stats?.byStatus?.['In Progress'] ?? 0;
  const wonLeads = stats?.byStatus?.['Closed - Won'] ?? 0;
  const conversionRate = stats?.conversionRate ?? 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">Total Leads</div>
          <div className="stat-value">{loading ? '...' : total}</div>
          <div className="stat-sub">{stats?.last7DaysCount ?? 0} added in last 7 days</div>
        </div>
        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          <Users size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">New Opportunities</div>
          <div className="stat-value">{loading ? '...' : newLeads}</div>
          <div className="stat-sub">Awaiting first contact</div>
        </div>
        <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
          <Sparkles size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">Active Pipeline</div>
          <div className="stat-value">{loading ? '...' : inProgress}</div>
          <div className="stat-sub">In progress & discussions</div>
        </div>
        <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
          <Clock size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">Won / Converted</div>
          <div className="stat-value">{loading ? '...' : `${conversionRate}%`}</div>
          <div className="stat-sub">{wonLeads} closed deals</div>
        </div>
        <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
          <CheckCircle2 size={24} />
        </div>
      </div>
    </div>
  );
};
