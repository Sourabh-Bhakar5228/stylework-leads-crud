import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { LeadFilters } from './components/LeadFilters';
import { LeadTable } from './components/LeadTable';
import { LeadKanban } from './components/LeadKanban';
import { LeadModal } from './components/LeadModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import {
  fetchLeads,
  fetchLeadStats,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead
} from './api/leadApi';
import { Lead, LeadFormData, LeadStats, LeadStatus, ToastMessage } from './types';

export const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & View State
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'status' | 'email'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Modals & Feedback
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Debounce search input by 300ms
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  // Toast Helper
  const showToast = useCallback((title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Stats
  const loadStats = useCallback(async () => {
    try {
      const statsData = await fetchLeadStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Fetch Leads
  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchLeads({
        search: debouncedSearch,
        status: selectedStatus,
        sortBy,
        sortOrder,
        limit: 100
      });
      setLeads(res.data);
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedStatus, sortBy, sortOrder, showToast]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Lead Creation / Update Handler
  const handleSaveLead = async (formData: LeadFormData) => {
    if (editingLead) {
      const updated = await updateLead(editingLead._id, formData);
      setLeads((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
      showToast('Lead Updated', `${updated.name}'s information was saved successfully.`);
    } else {
      const created = await createLead(formData);
      setLeads((prev) => [created, ...prev]);
      showToast('Lead Created', `Added ${created.name} to the pipeline.`);
    }
    loadStats();
  };

  // Fast Inline Status Update
  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    // Optimistic UI update
    const previous = leads.find((l) => l._id === id);
    setLeads((prev) =>
      prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
    );

    try {
      const updated = await updateLeadStatus(id, newStatus);
      showToast('Status Updated', `${updated.name} moved to "${newStatus}".`);
      loadStats();
    } catch (err: any) {
      // Revert on error
      if (previous) {
        setLeads((prev) => prev.map((l) => (l._id === id ? previous : l)));
      }
      showToast('Failed to update status', err.message, 'error');
    }
  };

  // Lead Deletion Handler
  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      showToast('Lead Deleted', 'Lead removed successfully.');
      loadStats();
    } catch (err: any) {
      showToast('Delete Failed', err.message, 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation & Actions */}
      <Header
        onOpenCreateModal={() => {
          setEditingLead(null);
          setIsModalOpen(true);
        }}
        totalLeads={leads.length}
      />

      {/* KPI Overview Metrics */}
      <StatsCards stats={stats} loading={loading && !stats} />

      {/* Search, Filter & View Controls */}
      <LeadFilters
        search={search}
        onSearchChange={setSearch}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(sb, so) => {
          setSortBy(sb);
          setSortOrder(so);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusCounts={stats?.byStatus}
      />

      {/* Main View: Table vs Kanban */}
      {viewMode === 'table' ? (
        <LeadTable
          leads={leads}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
          onEditLead={(lead) => {
            setEditingLead(lead);
            setIsModalOpen(true);
          }}
          onDeleteLead={(lead) => setDeletingLead(lead)}
          onOpenCreateModal={() => {
            setEditingLead(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <LeadKanban
          leads={leads}
          onUpdateStatus={handleUpdateStatus}
          onEditLead={(lead) => {
            setEditingLead(lead);
            setIsModalOpen(true);
          }}
          onDeleteLead={(lead) => setDeletingLead(lead)}
        />
      )}

      {/* Create / Edit Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleSaveLead}
        initialData={editingLead}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingLead}
        lead={deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
