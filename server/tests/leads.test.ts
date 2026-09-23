import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { Lead } from '../src/models/Lead.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Lead.deleteMany({});
});

describe('Lead Tracker API Endpoints', () => {
  describe('Health Check', () => {
    it('GET /api/health should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('POST /api/leads', () => {
    it('should create a new lead with valid data', async () => {
      const newLead = {
        name: 'Rohan Verma',
        email: 'rohan.verma@example.com',
        phone: '+91 99887 76655',
        status: 'New',
        notes: 'Requested a demo call for coworking space.'
      };

      const res = await request(app)
        .post('/api/leads')
        .send(newLead);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(newLead.name);
      expect(res.body.data.email).toBe(newLead.email);
      expect(res.body.data.status).toBe('New');
      expect(res.body.data._id).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();
    });

    it('should reject lead creation if name is shorter than 2 characters', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          name: 'A',
          email: 'valid@example.com',
          phone: '123456789'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name' })
        ])
      );
    });

    it('should reject lead creation if email format is invalid', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          name: 'Test Lead',
          email: 'invalid-email-address',
          phone: '123456789'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' })
        ])
      );
    });

    it('should reject lead creation if status is not an allowed enum value', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          name: 'Test Lead',
          email: 'test@example.com',
          phone: '123456789',
          status: 'InvalidStatus'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'status' })
        ])
      );
    });
  });

  describe('GET /api/leads', () => {
    beforeEach(async () => {
      await Lead.insertMany([
        { name: 'Alice Smith', email: 'alice@alpha.com', phone: '+1 555 101', status: 'New' },
        { name: 'Bob Jones', email: 'bob@beta.com', phone: '+1 555 202', status: 'Contacted' },
        { name: 'Charlie Day', email: 'charlie@gamma.com', phone: '+1 555 303', status: 'Closed - Won' }
      ]);
    });

    it('should return all leads with pagination metadata', async () => {
      const res = await request(app).get('/api/leads');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(3);
      expect(res.body.pagination.total).toBe(3);
    });

    it('should filter leads by status', async () => {
      const res = await request(app).get('/api/leads?status=Contacted');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Bob Jones');
    });

    it('should search leads by name', async () => {
      const res = await request(app).get('/api/leads?search=alice');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Alice Smith');
    });

    it('should search leads by email or phone', async () => {
      const resByEmail = await request(app).get('/api/leads?search=gamma.com');
      expect(resByEmail.status).toBe(200);
      expect(resByEmail.body.data.length).toBe(1);
      expect(resByEmail.body.data[0].name).toBe('Charlie Day');

      const resByPhone = await request(app).get('/api/leads?search=202');
      expect(resByPhone.status).toBe(200);
      expect(resByPhone.body.data.length).toBe(1);
      expect(resByPhone.body.data[0].name).toBe('Bob Jones');
    });
  });

  describe('PATCH /api/leads/:id/status', () => {
    it('should update lead status successfully', async () => {
      const lead = await Lead.create({
        name: 'Status Tester',
        email: 'status@tester.com',
        phone: '123456789',
        status: 'New'
      });

      const res = await request(app)
        .patch(`/api/leads/${lead._id}/status`)
        .send({ status: 'Qualified' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Qualified');

      const updated = await Lead.findById(lead._id);
      expect(updated?.status).toBe('Qualified');
    });

    it('should return 400 for invalid status', async () => {
      const lead = await Lead.create({
        name: 'Status Tester',
        email: 'status2@tester.com',
        phone: '123456789',
        status: 'New'
      });

      const res = await request(app)
        .patch(`/api/leads/${lead._id}/status`)
        .send({ status: 'BogusStatus' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/leads/:id', () => {
    it('should delete a lead by ID', async () => {
      const lead = await Lead.create({
        name: 'Delete Target',
        email: 'delete@target.com',
        phone: '123456789',
        status: 'New'
      });

      const res = await request(app).delete(`/api/leads/${lead._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await Lead.findById(lead._id);
      expect(check).toBeNull();
    });
  });

  describe('GET /api/leads/stats', () => {
    it('should return aggregate counts and conversion rate', async () => {
      await Lead.insertMany([
        { name: 'Lead 1', email: 'l1@test.com', phone: '+1 555 1111', status: 'New' },
        { name: 'Lead 2', email: 'l2@test.com', phone: '+1 555 2222', status: 'New' },
        { name: 'Lead 3', email: 'l3@test.com', phone: '+1 555 3333', status: 'Closed - Won' }
      ]);

      const res = await request(app).get('/api/leads/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(3);
      expect(res.body.data.byStatus['New']).toBe(2);
      expect(res.body.data.byStatus['Closed - Won']).toBe(1);
      expect(res.body.data.conversionRate).toBe(33); // 1/3 ~ 33%
    });
  });

  describe('GET /api/leads/export/csv', () => {
    it('should return text/csv with leads data', async () => {
      await Lead.create({
        name: 'Export Tester',
        email: 'export@test.com',
        phone: '+1 234 567',
        status: 'Qualified'
      });

      const res = await request(app).get('/api/leads/export/csv');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('Export Tester');
      expect(res.text).toContain('export@test.com');
    });
  });
});
