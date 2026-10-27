/**
 * UtsavPlan - Celebration & Event Planner Server
 * Pure Node.js HTTP server with minimal dependencies, zero bloated frameworks,
 * security headers, static file serving, rate limiting, and robust API endpoints.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validatePlanInput } from './src/validator.js';
import { calculateBudget, calculateTimeline, generateChecklists, generateWarnings, generateCeremonyPathway } from './src/planner.js';
import { getCelebrationIdeas } from './src/llm/router.js';
import { generateIcs } from './src/ics.js';
import { TRANSLATIONS } from './src/i18n.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, 'public');

// Port configuration: listens on process.env.PORT (default 3000)
export const PORT = parseInt(process.env.PORT || '3000', 10);

// Security: Max request payload size (100 KB)
const MAX_PAYLOAD_BYTES = 100 * 1024;

// Simple in-memory rate limiting per IP: 60 requests per minute
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 60;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, record);
    return true;
  }

  record.count += 1;
  rateLimitMap.set(ip, record);
  return record.count <= RATE_LIMIT_MAX_REQUESTS;
}

// Security headers
function setSecurityHeaders(res) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'self' *;");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
}

// Helper: reads incoming JSON request body with strict size limit
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let bytesReceived = 0;

    req.on('data', chunk => {
      bytesReceived += chunk.length;
      if (bytesReceived > MAX_PAYLOAD_BYTES) {
        const err = new Error('Payload Too Large: Maximum allowed size is 100 KB');
        err.statusCode = 413;
        req.destroy();
        return reject(err);
      }
      raw += chunk;
    });

    req.on('end', () => {
      if (!raw.trim()) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(raw);
        resolve(parsed);
      } catch (e) {
        const err = new Error('Invalid JSON format in request body');
        err.statusCode = 400;
        reject(err);
      }
    });

    req.on('error', err => {
      reject(err);
    });
  });
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};

// Static file server with path traversal protection
function serveStaticFile(req, res, pathname) {
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Request' }));
    return;
  }

  // Block directory traversal attempts explicitly
  if (decodedPath.includes('..') || pathname.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Access denied: Directory traversal detected.' }));
    return;
  }

  const normalized = path.normalize(decodedPath).replace(/^(\.\.[\/\\])+/, '');
  const targetPath = normalized === '/' || normalized === '.' ? '/index.html' : normalized;
  const safePath = path.resolve(PUBLIC_DIR, '.' + (targetPath.startsWith('/') ? targetPath : '/' + targetPath));

  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Access denied: Directory traversal detected.' }));
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    setSecurityHeaders(res);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'public, max-age=3600',
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
}

/**
 * Main HTTP Request Handler
 */
export async function handleRequest(req, res) {
  setSecurityHeaders(res);

  // Block directory traversal attempts immediately on raw req.url
  if (req.url.includes('..') || req.url.includes('%2e%2e') || req.url.includes('%2E%2E')) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Access denied: Directory traversal detected.' }));
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // 1. Healthcheck endpoint
  if (pathname === '/healthz' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', service: 'utsavplan', timestamp: new Date().toISOString() }));
    return;
  }

  // Rate limit check for API endpoints
  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(clientIp)) {
      res.writeHead(429, {
        'Content-Type': 'application/json; charset=utf-8',
        'Retry-After': '60',
      });
      res.end(JSON.stringify({ error: 'Rate limit exceeded. Please wait 60 seconds.' }));
      return;
    }
  }

  // 2. Translations endpoint
  if (pathname === '/api/i18n' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ translations: TRANSLATIONS }));
    return;
  }

  // 3. Plan Generation API
  if (pathname === '/api/plan' && method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const validation = validatePlanInput(body);

      if (!validation.valid) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, errors: validation.errors }));
        return;
      }

      const input = validation.data;

      // Pure calculations
      const budgetResult = calculateBudget(input);
      const timelineResult = calculateTimeline({
        eventType: input.eventType,
        eventDate: input.date,
        tradition: input.tradition,
      });
      const checklistsResult = generateChecklists(input);
      const warningsResult = generateWarnings({
        eventType: input.eventType,
        budget: input.budget,
        guestCount: input.guestCount,
        leadTimeDays: timelineResult.leadTimeDays,
        setting: input.setting,
        tradition: input.tradition,
      });

      // LLM ladder ideas generation
      const ideasResult = await getCelebrationIdeas(input);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(
        JSON.stringify({
          success: true,
          plan: {
            input,
            budget: budgetResult,
            timeline: timelineResult,
            checklists: checklistsResult,
            warnings: warningsResult,
            pathway: generateCeremonyPathway(input),
          },
          ideas: ideasResult.ideas,
          ideasSource: ideasResult.ideasSource,
        })
      );
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }));
    }
    return;
  }

  // 4. Calendar (.ics) Export API
  if (pathname === '/api/export-ics' && method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const eventName = body.eventName || 'Celebration Plan';
      const milestones = Array.isArray(body.milestones) ? body.milestones : [];
      const lang = body.lang || 'en';

      const icsContent = generateIcs({ eventName, milestones, lang });

      res.writeHead(200, {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="utsavplan-timeline.ics"',
      });
      res.end(icsContent);
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: err.message || 'Could not export calendar' }));
    }
    return;
  }

  // 5. Static file serving
  if (method === 'GET' || method === 'HEAD') {
    serveStaticFile(req, res, pathname);
    return;
  }

  // Method not allowed
  res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Method Not Allowed');
}

/**
 * Creates and starts server instance
 */
export function createServer() {
  return http.createServer(handleRequest);
}

// Only start listening when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`UtsavPlan celebration planner running at http://0.0.0.0:${PORT}`);
  });
}
