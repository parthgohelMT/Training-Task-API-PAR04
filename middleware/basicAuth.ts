import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

function safeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export function basicAuth(req: Request, res: Response, next: NextFunction): void | Response {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Task API"');
    return res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') {
    res.setHeader('WWW-Authenticate', 'Basic realm="Task API"');
    return res.status(401).json({ error: 'Unauthorized: Invalid authentication scheme' });
  }

  let decoded: string;
  try {
    decoded = Buffer.from(parts[1], 'base64').toString('utf8');
  } catch {
    res.setHeader('WWW-Authenticate', 'Basic realm="Task API"');
    return res.status(401).json({ error: 'Unauthorized: Malformed credentials' });
  }

  const colonIndex = decoded.indexOf(':');
  if (colonIndex === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Task API"');
    return res.status(401).json({ error: 'Unauthorized: Malformed credentials' });
  }

  const username = decoded.slice(0, colonIndex);
  const password = decoded.slice(colonIndex + 1);

  const expectedUsername = process.env.BASIC_AUTH_USERNAME || 'admin';
  const expectedPassword = process.env.BASIC_AUTH_PASSWORD || 'admin123';

  const userMatch = safeCompare(username, expectedUsername);
  const passMatch = safeCompare(password, expectedPassword);

  if (!userMatch || !passMatch) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Task API"');
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
  }

  return next();
}

export default basicAuth;
