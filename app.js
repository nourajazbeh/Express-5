const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');

// Initialisiere den Express-Server
const app = express();
const PORT = process.env.PORT || 3000;

// Konfiguriere Winston Logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Middleware, um Anfragedetails zu loggen
app.use((req, res, next) => {
    logger.info(`HTTP ${req.method} ${req.url}`, {
        method: req.method,
        url: req.url,
        path: req.path,
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
        ip: req.ip
    });
    next();
});

// Middleware, um JSON-Anfragekörper zu parsen
app.use(bodyParser.json());

// Routen
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});

app.get('/data', (req, res) => {
    res.json({ message: 'GET request to /data' });
});

app.post('/data', (req, res) => {
    res.json({ message: 'POST request to /data', data: req.body });
});

app.put('/data', (req, res) => {
    res.json({ message: 'PUT request to /data', data: req.body });
});

app.delete('/data', (req, res) => {
    res.json({ message: 'DELETE request to /data' });
});

// Zentrale Fehlerbehandlungsmiddleware
app.use((err, req, res, next) => {
    logger.error(err.message, {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        stack: err.stack
    });
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Starte den Server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
