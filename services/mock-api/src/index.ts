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
  const { status, classroom_id, priority } = req.query;
  let alerts = dataStore.getAlerts(status as any);
  
  // Additional filtering
  if (classroom_id) {
    alerts = alerts.filter(alert => alert.classroom_id === classroom_id);
  }
  if (priority) {
    alerts = alerts.filter(alert => alert.priority === priority);
  }
  
  // Return direct array for prototype simplicity
  res.json(alerts);
});

app.get('/api/alerts/:alert_id', (req, res) => {
  const { alert_id } = req.params;
  const alert = dataStore.getAlert(alert_id);
  
  if (!alert) {
    return res.status(404).json({ 
      error: {
        code: 'ALERT_NOT_FOUND',
        message: `Alert with ID '${alert_id}' not found`,
        details: { alert_id }
      }
    });
  }
  
  res.json(alert);
});

app.post('/api/alerts/:alert_id/acknowledge', (req, res) => {
  const { alert_id } = req.params;
  const updatedAlert = dataStore.updateAlertStatus(alert_id, 'acknowledged');
  
  if (!updatedAlert) {
    return res.status(404).json({ 
      error: {
        code: 'ALERT_NOT_FOUND',
        message: `Alert with ID '${alert_id}' not found`,
        details: { alert_id }
      }
    });
  }

  io.emit('alert.updated', updatedAlert);
  io.emit(`alert.updated.${updatedAlert.alert_id}`, updatedAlert);
  
  res.json({
    status: 'acknowledged',
    acknowledged_at: new Date().toISOString()
  });
});

app.post('/api/alerts/:alert_id/resolve', (req, res) => {
  const { alert_id } = req.params;
  const updatedAlert = dataStore.updateAlertStatus(alert_id, 'resolved');
  
  if (!updatedAlert) {
    return res.status(404).json({ 
      error: {
        code: 'ALERT_NOT_FOUND',
        message: `Alert with ID '${alert_id}' not found`,
        details: { alert_id }
      }
    });
  }

  io.emit('alert.updated', updatedAlert);
  io.emit(`alert.updated.${updatedAlert.alert_id}`, updatedAlert);
  
  res.json({
    status: 'resolved',
    resolved_at: new Date().toISOString()
  });
});

app.post('/api/alerts/:alert_id/false-positive', (req, res) => {
  const { alert_id } = req.params;
  const updatedAlert = dataStore.updateAlertStatus(alert_id, 'false_positive');
  
  if (!updatedAlert) {
    return res.status(404).json({ 
      error: {
        code: 'ALERT_NOT_FOUND',
        message: `Alert with ID '${alert_id}' not found`,
        details: { alert_id }
      }
    });
  }

  io.emit('alert.updated', updatedAlert);
  io.emit(`alert.updated.${updatedAlert.alert_id}`, updatedAlert);
  
  res.json({
    status: 'false_positive',
    marked_at: new Date().toISOString()
  });
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