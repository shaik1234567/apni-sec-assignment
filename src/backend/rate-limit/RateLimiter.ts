interface RateLimitEntry {
  count: number;
  resetTime: number;
  windowStart: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;
  
  // Default configuration
  private readonly defaultConfig: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  };

  // Endpoint-specific configurations
  private readonly endpointConfigs: Map<string, RateLimitConfig> = new Map([
    // Authentication endpoints - stricter limits
    ['auth/register', { maxRequests: 5, windowMs: 15 * 60 * 1000 }], // 5 per 15 min
    ['auth/login', { maxRequests: 10, windowMs: 15 * 60 * 1000 }], // 10 per 15 min
    ['auth/logout', { maxRequests: 20, windowMs: 15 * 60 * 1000 }], // 20 per 15 min
    
    // User profile endpoints - moderate limits
    ['users/profile', { maxRequests: 50, windowMs: 15 * 60 * 1000 }], // 50 per 15 min
    
    // Issue endpoints - standard limits
    ['issues', { maxRequests: 100, windowMs: 15 * 60 * 1000 }], // 100 per 15 min
    ['issues/create', { maxRequests: 20, windowMs: 15 * 60 * 1000 }], // 20 per 15 min
    
    // Test endpoints - very strict limits
    ['test-email', { maxRequests: 3, windowMs: 15 * 60 * 1000 }], // 3 per 15 min
    
    // Health check - lenient
    ['health', { maxRequests: 200, windowMs: 15 * 60 * 1000 }] // 200 per 15 min
  ]);

  private constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    
    console.log('🛡️ RateLimiter initialized with endpoint-specific limits');
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  /**
   * Check if a request is allowed based on rate limiting rules
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @param endpoint - Optional endpoint path for specific limits
   * @returns Rate limit result with headers info
   */
  public checkLimit(identifier: string, endpoint?: string): RateLimitResult {
    const config = this.getConfigForEndpoint(endpoint);
    const key = this.generateKey(identifier, endpoint);
    const now = Date.now();
    
    let entry = this.store.get(key);

    // Check if we need to reset the window
    if (!entry || now >= entry.resetTime) {
      // Create new window
      entry = {
        count: 1,
        resetTime: now + config.windowMs,
        windowStart: now
      };
      this.store.set(key, entry);
      
      return {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: entry.resetTime
      };
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter
      };
    }

    // Increment counter
    entry.count++;
    
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Get configuration for specific endpoint
   * @param endpoint - Endpoint path
   * @returns Rate limit configuration
   */
  private getConfigForEndpoint(endpoint?: string): RateLimitConfig {
    if (!endpoint) {
      return this.defaultConfig;
    }

    // Normalize endpoint path
    const normalizedEndpoint = endpoint.toLowerCase().replace(/^\/+|\/+$/g, '');
    
    // Check for exact match first
    if (this.endpointConfigs.has(normalizedEndpoint)) {
      return { ...this.defaultConfig, ...this.endpointConfigs.get(normalizedEndpoint) };
    }

    // Check for partial matches
    for (const [configEndpoint, config] of this.endpointConfigs.entries()) {
      if (normalizedEndpoint.includes(configEndpoint)) {
        return { ...this.defaultConfig, ...config };
      }
    }

    return this.defaultConfig;
  }

  /**
   * Generate unique key for rate limiting
   * @param identifier - Base identifier
   * @param endpoint - Optional endpoint
   * @returns Unique key
   */
  private generateKey(identifier: string, endpoint?: string): string {
    const baseKey = `rate_limit:${identifier}`;
    return endpoint ? `${baseKey}:${endpoint}` : baseKey;
  }

  /**
   * Clean up expired entries from memory
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 RateLimiter cleaned up ${cleanedCount} expired entries`);
    }
  }

  /**
   * Reset rate limit for specific identifier
   * @param identifier - Identifier to reset
   * @param endpoint - Optional specific endpoint
   */
  public reset(identifier: string, endpoint?: string): void {
    const key = this.generateKey(identifier, endpoint);
    this.store.delete(key);
  }

  /**
   * Get current stats for identifier
   * @param identifier - Identifier to check
   * @param endpoint - Optional endpoint
   * @returns Current rate limit stats
   */
  public getStats(identifier: string, endpoint?: string): { count: number; resetTime: number; remaining: number } | null {
    const config = this.getConfigForEndpoint(endpoint);
    const key = this.generateKey(identifier, endpoint);
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }
    
    return {
      count: entry.count,
      resetTime: entry.resetTime,
      remaining: Math.max(0, config.maxRequests - entry.count)
    };
  }

  /**
   * Add or update endpoint configuration
   * @param endpoint - Endpoint path
   * @param config - Rate limit configuration
   */
  public setEndpointConfig(endpoint: string, config: Partial<RateLimitConfig>): void {
    const normalizedEndpoint = endpoint.toLowerCase().replace(/^\/+|\/+$/g, '');
    this.endpointConfigs.set(normalizedEndpoint, { ...this.defaultConfig, ...config });
  }

  /**
   * Get all current rate limit entries (for debugging)
   */
  public getAllEntries(): Map<string, RateLimitEntry> {
    return new Map(this.store);
  }

  /**
   * Clear all rate limit entries
   */
  public clearAll(): void {
    this.store.clear();
    console.log('🧹 RateLimiter cleared all entries');
  }

  /**
   * Cleanup on shutdown
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}