import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  updateLead,
  deleteLead,
  getLeadStats,
  exportLeadsCSV
} from '../controllers/lead.controller';
import {
  validateBody,
  createLeadSchema,
  updateLeadStatusSchema,
  updateLeadSchema
} from '../middleware/validation';

const router = Router();

// Stats & CSV Export routes (placed before :id to prevent param clash)
router.get('/stats', getLeadStats);
router.get('/export/csv', exportLeadsCSV);

// Standard CRUD routes
router.route('/')
  .get(getLeads)
  .post(validateBody(createLeadSchema), createLead);

router.route('/:id')
  .get(getLeadById)
  .put(validateBody(updateLeadSchema), updateLead)
  .delete(deleteLead);

// Specialized route for updating status quickly
router.patch('/:id/status', validateBody(updateLeadStatusSchema), updateLeadStatus);

export default router;
