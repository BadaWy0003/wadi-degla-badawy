// Simple in-memory rate limiter (no external dependency).
// Counts are per server machine; Fly runs 2 machines, so the effective limit
// per visitor can be up to 2x the configured value. That is acceptable for spam control.

// Fly's edge proxy sets Fly-Client-IP to the real visitor IP.
const getClientIp = (req) => req.get('fly-client-ip') || req.ip || 'unknown';

const rateLimit = ({ windowMs, max }) => {
  const hits = new Map(); // ip -> { count, resetAt }

  // Drop expired entries so the map can't grow forever.
  setInterval(() => {
    const now = Date.now();
    hits.forEach((entry, ip) => {
      if (entry.resetAt <= now) hits.delete(ip);
    });
  }, windowMs).unref();

  return (req, res, next) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const entry = hits.get(ip);

    if (!entry || entry.resetAt <= now) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
    }
    return next();
  };
};

module.exports = { rateLimit, getClientIp };
