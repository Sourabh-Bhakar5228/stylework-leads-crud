import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead.model';
import { LEAD_STATUSES, LeadStatus } from '../types/lead.types';

/**
 * @route   POST /api/leads
 * @desc    Create a new lead
 */
export async function createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, phone, status, notes } = req.body;
    const lead = await Lead.create({
      name,
      email,
      phone,
      status: status || 'New',
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/leads
 * @desc    Get all leads with search, status filter, sorting, and pagination
 */
export async function getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '50'
    } = req.query;

    const query: Record<string, any> = {};

    // Status filtering
    if (status && status !== 'All') {
      query.status = status;
    }

    // Live search query matching name, email, or phone
    if (search && typeof search === 'string' && search.trim() !== '') {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitized, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(200, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    // Sort order definition
    const order = sortOrder === 'asc' ? 1 : -1;
    const sortField = typeof sortBy === 'string' ? sortBy : 'createdAt';
    const sortOptions: Record<string, any> = { [sortField]: order };

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Lead.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < totalPages
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/leads/:id
 * @desc    Get a single lead by ID
 */
export async function getLeadById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   PATCH /api/leads/:id/status
 * @desc    Update only the status of a lead
 */
export async function updateLeadStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   PUT /api/leads/:id
 * @desc    Update lead details (name, email, phone, status, notes)
 */
export async function updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead
 */
export async function deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/leads/stats
 * @desc    Get aggregate lead statistics for dashboard overview
 */
export async function getLeadStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const total = await Lead.countDocuments();

    // Counts by status
    const statusCounts = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const byStatus = LEAD_STATUSES.reduce((acc, curr) => {
      acc[curr] = 0;
      return acc;
    }, {} as Record<LeadStatus, number>);

    statusCounts.forEach(item => {
      if (item._id && item._id in byStatus) {
        byStatus[item._id as LeadStatus] = item.count;
      }
    });

    // Won rate
    const wonCount = byStatus['Closed - Won'] || 0;
    const conversionRate = total > 0 ? Math.round((wonCount / total) * 100) : 0;

    // Leads in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7DaysCount = await Lead.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus,
        conversionRate,
        last7DaysCount
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/leads/export/csv
 * @desc    Export leads to downloadable CSV format
 */
export async function exportLeadsCSV(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Notes', 'Created At'];
    const rows = leads.map(l => [
      `"${l._id}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
}
