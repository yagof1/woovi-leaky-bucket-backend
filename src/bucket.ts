import { LeakyBucketConfig, BucketResult } from './types';
import { UserBucketModel, UserBucketDocument } from './models/UserBucket';

const DEFAULT_CONFIG: LeakyBucketConfig = {
  maxTokens: parseInt(process.env.BUCKET_MAX_TOKENS || '10'),
  refillRate: parseInt(process.env.BUCKET_REFILL_RATE || '1'),
  refillInterval: parseInt(process.env.BUCKET_REFILL_INTERVAL || '3600000')
};

class LeakyBucketManager {
  private config: LeakyBucketConfig;

  constructor(config: LeakyBucketConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  private async createBucket(userId: string): Promise<UserBucketDocument> {
    const now = Date.now();
    const bucket = new UserBucketModel({
      userId,
      tokens: this.config.maxTokens,
      lastRefill: now,
      createdAt: now
    });
    
    return await bucket.save();
  }

  private async refillTokens(bucket: UserBucketDocument): Promise<void> {
    const now = Date.now();
    const timeSinceLastRefill = now - bucket.lastRefill;
    const intervalsElapsed = Math.floor(timeSinceLastRefill / this.config.refillInterval);
    
    if (intervalsElapsed > 0) {
      const tokensToAdd = intervalsElapsed * this.config.refillRate;
      bucket.tokens = Math.min(this.config.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
      await bucket.save();
    }
  }

  public async consumeToken(userId: string): Promise<BucketResult> {
    let bucket = await UserBucketModel.findOne({ userId }) as UserBucketDocument | null;
    
    if (!bucket) {
      bucket = await this.createBucket(userId);
    }

    await this.refillTokens(bucket);

    if (bucket.tokens <= 0) {
      const timeUntilRefill = this.config.refillInterval - (Date.now() - bucket.lastRefill);
      return {
        allowed: false,
        remainingTokens: 0,
        retryAfter: Math.ceil(timeUntilRefill / 1000)
      };
    }

    bucket.tokens -= 1;
    await bucket.save();

    return {
      allowed: true,
      remainingTokens: bucket.tokens
    };
  }

  public async returnToken(userId: string): Promise<void> {
    const bucket = await UserBucketModel.findOne({ userId }) as UserBucketDocument | null;
    if (bucket && bucket.tokens < this.config.maxTokens) {
      bucket.tokens += 1;
      await bucket.save();
    }
  }

  public async getBucketStatus(userId: string): Promise<BucketResult> {
    let bucket = await UserBucketModel.findOne({ userId }) as UserBucketDocument | null;
    
    if (!bucket) {
      bucket = await this.createBucket(userId);
    }

    await this.refillTokens(bucket);
    
    return {
      allowed: bucket.tokens > 0,
      remainingTokens: bucket.tokens
    };
  }
}

export const bucketManager = new LeakyBucketManager();