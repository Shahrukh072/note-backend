require('dotenv').config();
const express = require('express');
const cors = require('cors');
const client = require('prom-client'); //for metrics
const logger = require('./common/logger.js');
const healthCheck = require('./common/healthCheck.js');
const connectDB = require('./config/db.config.js');
const notesRoutes = require('./routes/notes.js');

const PORT = process.env.PORT || 4040;


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Prometheus Metrics Setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

// HTTP request logging for metrics
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.route?.path || req.path, res.statusCode).inc();
  });
  next();
});

// Health
app.use('/api/health', healthCheck);

// Routes
app.use('/api/notes', require('./routes/notes.js'));

// Expose /metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

// Start server
app.listen(PORT, () => {
    logger.info(`Server running on port:${PORT}`)
});