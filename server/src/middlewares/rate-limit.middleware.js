// Simple in-memory rate limiter (no external dependency).
// Counts are per server machine; Fly runs 2 machines, so the effective limit
// per visitor can be up to 2x the configured value. That is acceptable for spam control.

// Fly's edge proxy sets Fly-Client-IP to the real visitor IP.
// Requests the website's nginx passes on over Fly's private network (spec sheets served on
// www.wadidegla-eg.com, 2026-11-25) have no Fly-Client-IP, come from a private fdaa: address
// and name the visitor in X-WD-Visitor-IP. That header is only trusted on such requests: every
// request from the internet goes through Fly's edge, which always sets Fly-Client-IP.
const getClientIp = (req) => {
  const fly = req.get('fly-client-ip');
  if (fly) return fly;
  const from = String(req.socket?.remoteAddress || '');
  const visitor = req.get('x-wd-visitor-ip');
  if (from.startsWith('fdaa:') && visitor) return `site:${visitor.slice(0, 60)}`;
  return req.ip || 'unknown';
};

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
      const error = 'Too many requests. Please try again later.';
      return res.status(429).json({ success: false, error, message: error });
    }
    return next();
  };
};

module.exports = { rateLimit, getClientIp };
