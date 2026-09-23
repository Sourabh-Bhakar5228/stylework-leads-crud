import { Lead } from '../models/Lead.model';

export const sampleLeads = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@techcorp.io',
    phone: '+91 98765 43210',
    status: 'New',
    notes: 'Interested in enterprise coworking desks for team of 15.'
  },
  {
    name: 'Sophia Chen',
    email: 'sophia.chen@globalventures.com',
    phone: '+1 415 555 0192',
    status: 'Contacted',
    notes: 'Followed up regarding private office space in downtown.'
  },
  {
    name: 'Liam Vance',
    email: 'liam.vance@apexdesign.co',
    phone: '+44 20 7946 0912',
    status: 'In Progress',
    notes: 'Sent customized pricing proposal. Waiting for finance approval.'
  },
  {
    name: 'Priyanka Patel',
    email: 'priyanka.patel@innovatetech.in',
    phone: '+91 98234 56789',
    status: 'Qualified',
    notes: 'Budget confirmed, lease terms under review.'
  },
  {
    name: 'Elena Rostova',
    email: 'elena.r@nordicscale.se',
    phone: '+46 8 123 4567',
    status: 'Closed - Won',
    notes: 'Signed 12-month agreement for hybrid workspace membership.'
  },
  {
    name: 'Marcus Brody',
    email: 'marcus.brody@nexusretail.org',
    phone: '+1 212 555 0184',
    status: 'Closed - Lost',
    notes: 'Decided to renew existing lease at current premises.'
  }
];

export async function seedInitialLeadsIfEmpty(): Promise<void> {
  try {
    const count = await Lead.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Seeding initial sample leads for demonstration...');
      await Lead.insertMany(sampleLeads);
      console.log('✅ Successfully seeded 6 sample leads.');
    }
  } catch (error) {
    console.warn('⚠️ Seeding skipped or encountered non-critical error:', error);
  }
}
