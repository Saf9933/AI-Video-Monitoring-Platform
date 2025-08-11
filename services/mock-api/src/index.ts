import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { dataStore } from './dataStore';
import { AlertGenerator } from './alertGenerator';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/alerts', (req, res) => {
  const { status } = req.query;
  const alerts = dataStore.getAlerts(status as any);
  res.json(alerts);
});

app.post('/api/alerts/:id/ack', (req, res) => {
  const { id } = req.params;
  const updatedAlert = dataStore.updateAlertStatus(id, 'acknowledged');
  
  if (!updatedAlert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  io.emit('alert.updated', updatedAlert);
  res.json(updatedAlert);
});

app.post('/api/alerts/:id/resolve', (req, res) => {
  const { id } = req.params;
  const updatedAlert = dataStore.updateAlertStatus(id, 'resolved');
  
  if (!updatedAlert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  io.emit('alert.updated', updatedAlert);
  res.json(updatedAlert);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const alertGenerator = new AlertGenerator(dataStore, io);
alertGenerator.start();

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Mock API server running on port ${PORT}`);
  });
}

export { app, server, io };