export interface LeakyBucketConfig {
  maxTokens: number;
  refillRate: number;
  refillInterval: number;
}

export interface UserBucket {
  userId: string;
  tokens: number;
  lastRefill: number;
  createdAt: number;
}

export interface BucketResult {
  allowed: boolean;
  remainingTokens: number;
  retryAfter?: number;
}

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface PixKeyQueryResult {
  success: boolean;
  message: string;
  remainingTokens: number;
  key?: string;
}

export interface AuthContext {
  userId: string;
  isAuthenticated: boolean;
}

export interface GraphQLContext {
  auth: AuthContext;
  bucket: BucketResult;
}