import request from 'supertest';
import { app, server, io } from '../src/index';
import { Client } from 'socket.io-client';

describe('Mock API', () => {
  afterAll((done) => {
    server.close(done);
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/healthz')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Alerts API', () => {
    it('should get all alerts', async () => {
      const response = await request(app)
        .get('/api/alerts')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const alert = response.body[0];
      expect(alert).toHaveProperty('id');
      expect(alert).toHaveProperty('studentId');
      expect(alert).toHaveProperty('type');
      expect(alert).toHaveProperty('severity');
      expect(alert).toHaveProperty('confidence');
      expect(alert).toHaveProperty('status');
      expect(alert).toHaveProperty('createdAt');
      
      expect(['emotional_distress', 'bullying_incident', 'pattern_detected']).toContain(alert.type);
      expect(['low', 'medium', 'high', 'critical']).toContain(alert.severity);
      expect(['open', 'acknowledged', 'resolved']).toContain(alert.status);
      expect(typeof alert.confidence).toBe('number');
      expect(alert.confidence).toBeGreaterThanOrEqual(0.6);
      expect(alert.confidence).toBeLessThanOrEqual(1.0);
    });

    it('should filter alerts by status', async () => {
      const response = await request(app)
        .get('/api/alerts?status=open')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((alert: any) => {
        expect(alert.status).toBe('open');
      });
    });

    it('should acknowledge an alert', async () => {
      const alertsResponse = await request(app).get('/api/alerts');
      const firstAlert = alertsResponse.body[0];

      const response = await request(app)
        .post(`/api/alerts/${firstAlert.id}/ack`)
        .expect(200);

      expect(response.body.status).toBe('acknowledged');
      expect(response.body.id).toBe(firstAlert.id);
    });

    it('should resolve an alert', async () => {
      const alertsResponse = await request(app).get('/api/alerts');
      const firstAlert = alertsResponse.body[0];

      const response = await request(app)
        .post(`/api/alerts/${firstAlert.id}/resolve`)
        .expect(200);

      expect(response.body.status).toBe('resolved');
      expect(response.body.id).toBe(firstAlert.id);
    });

    it('should return 404 for non-existent alert', async () => {
      await request(app)
        .post('/api/alerts/non-existent-id/ack')
        .expect(404);
    });
  });
});

describe('WebSocket', () => {
  let clientSocket: any;

  beforeEach((done) => {
    server.listen(() => {
      const port = (server.address() as any)?.port;
      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });
  });

  afterEach(() => {
    server.close();
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  it('should emit alert.updated when alert is acknowledged', (done) => {
    clientSocket.on('alert.updated', (alert: any) => {
      expect(alert).toHaveProperty('id');
      expect(alert.status).toBe('acknowledged');
      done();
    });

    request(app).get('/api/alerts').then((response) => {
      const firstAlert = response.body[0];
      request(app).post(`/api/alerts/${firstAlert.id}/ack`).end();
    });
  });
});