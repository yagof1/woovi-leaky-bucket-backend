import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';
import { JWTPayload, AuthContext } from './types';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  try {
    const authHeader = ctx.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: 'Missing or invalid authorization header' };
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    ctx.state.auth = {
      userId: payload.userId,
      isAuthenticated: true
    } as AuthContext;

    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid or expired token' };
  }
};