# 🛡️ Rate Limiting Implementation

## Overview

ApniSec implements a comprehensive, production-ready rate limiting system using Object-Oriented Programming principles. The system provides endpoint-specific limits, proper HTTP headers, and intelligent client identification.

## Features

✅ **Object-Oriented Architecture**: Full OOP implementation with singleton pattern  
✅ **Endpoint-Specific Limits**: Different limits for different API endpoints  
✅ **Standard Headers**: X-RateLimit-* headers as per HTTP standards  
✅ **Intelligent Identification**: User ID (JWT) > IP Address fallback  
✅ **Memory Efficient**: Automatic cleanup of expired entries  
✅ **Production Ready**: Proper error handling and logging  
✅ **Configurable**: Easy to modify limits per endpoint  

## Rate Limit Configuration

### Default Limits
- **Standard**: 100 requests per 15 minutes
- **Window**: 15 minutes (900 seconds)
- **Cleanup**: Every 5 minutes

### Endpoint-Specific Limits

| Endpoint | Limit | Window | Reason |
|----------|-------|--------|---------|
| `auth/register` | 5 | 15 min | Prevent spam registrations |
| `auth/login` | 10 | 15 min | Prevent brute force attacks |
| `auth/logout` | 20 | 15 min | Allow multiple logout attempts |
| `users/profile` | 50 | 15 min | Moderate profile access |
| `issues` | 100 | 15 min | Standard issue browsing |
| `issues/create` | 20 | 15 min | Prevent issue spam |
| `test-email` | 3 | 15 min | Very strict for testing |
| `health` | 200 | 15 min | Lenient for monitoring |

## HTTP Headers

### Standard Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703174400
X-RateLimit-Policy: 100;w=900
```

### When Rate Limited (429)
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1703174400
Retry-After: 300
X-RateLimit-Reset-Time: 2023-12-21T12:00:00.000Z
```

## Client Identification

### Priority Order
1. **User ID** (from JWT token): `user:507f1f77bcf86cd799439011`
2. **IP Address** (fallback): `ip:192.168.1.100`

### IP Detection Headers
- `cf-connecting-ip` (Cloudflare)
- `x-real-ip`
- `x-client-ip`
- `x-forwarded-for`

## Usage Examples

### Basic Usage in Handler
```typescript
export class AuthHandler {
  private rateLimitMiddleware: RateLimitMiddleware;

  public async login(request: NextRequest): Promise<NextResponse> {
    try {
      // Apply endpoint-specific rate limiting
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'auth/login');
      
      // Your business logic here
      const result = await this.authService.login(body);
      
      const nextResponse = NextResponse.json(result);
      
      // Add rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        nextResponse.headers.set(key, value);
      });

      return nextResponse;
    } catch (error) {
      // Rate limit errors are automatically handled
      return this.handleError(error);
    }
  }
}
```

### Custom Endpoint Configuration
```typescript
// Add new endpoint configuration
const rateLimiter = RateLimiter.getInstance();
rateLimiter.setEndpointConfig('custom/endpoint', {
  maxRequests: 50,
  windowMs: 10 * 60 * 1000 // 10 minutes
});
```

### Create Endpoint-Specific Middleware
```typescript
const customMiddleware = RateLimitMiddleware.createEndpointMiddleware(
  'api/upload', 
  5, // 5 requests
  60 * 1000 // per minute
);
```

## Error Handling

### Rate Limit Exceeded (429)
```json
{
  "success": false,
  "message": "Rate limit exceeded. Too many requests. Please try again in 300 seconds.",
  "data": null
}
```

### Error Object Properties
```typescript
interface RateLimitError extends ApiError {
  rateLimitInfo: {
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfter: number;
    endpoint: string;
  }
}
```

## Architecture

### Core Classes

#### RateLimiter (Singleton)
- **Purpose**: Core rate limiting logic
- **Storage**: In-memory Map with automatic cleanup
- **Features**: Endpoint-specific configs, sliding window

#### RateLimitMiddleware
- **Purpose**: Request processing and header management
- **Features**: Client identification, endpoint detection, error handling

### Data Structures

```typescript
interface RateLimitEntry {
  count: number;
  resetTime: number;
  windowStart: number;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}
```

## Testing Rate Limits

### Test with curl
```bash
# Test auth/login endpoint (10 requests per 15 min)
for i in {1..12}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password"}' \
    -I | grep -E "(HTTP|X-RateLimit|Retry-After)"
  echo "---"
done
```

### Test with JavaScript
```javascript
// Test rate limiting
async function testRateLimit() {
  for (let i = 1; i <= 12; i++) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' })
      });
      
      console.log(`Request ${i}:`, {
        status: response.status,
        limit: response.headers.get('X-RateLimit-Limit'),
        remaining: response.headers.get('X-RateLimit-Remaining'),
        reset: response.headers.get('X-RateLimit-Reset'),
        retryAfter: response.headers.get('Retry-After')
      });
    } catch (error) {
      console.error(`Request ${i} failed:`, error);
    }
  }
}
```

## Monitoring & Debugging

### Get Rate Limit Stats
```typescript
const rateLimitMiddleware = new RateLimitMiddleware();
const stats = rateLimitMiddleware.getStats(request, 'auth/login');
console.log('Current stats:', stats);
```

### Reset Rate Limit
```typescript
rateLimitMiddleware.resetRateLimit(request, 'auth/login');
```

### View All Entries (Debug)
```typescript
const rateLimiter = RateLimiter.getInstance();
const allEntries = rateLimiter.getAllEntries();
console.log('All rate limit entries:', allEntries);
```

## Production Considerations

### Memory Usage
- Automatic cleanup every 5 minutes
- Entries expire after window period
- Memory usage scales with active users

### Scaling
- Current: In-memory storage (single instance)
- Future: Redis for multi-instance deployments

### Security
- IP-based fallback prevents bypass
- JWT-based identification for authenticated users
- Endpoint-specific limits prevent abuse

## Configuration

### Environment Variables
```env
# Optional: Custom rate limit settings
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_CLEANUP_INTERVAL=300000
```

### Customization
```typescript
// Modify default configuration
const rateLimiter = RateLimiter.getInstance();

// Add new endpoint
rateLimiter.setEndpointConfig('api/upload', {
  maxRequests: 10,
  windowMs: 60 * 1000
});

// Clear all limits (emergency)
rateLimiter.clearAll();
```

## Status

✅ **Implemented**: Full OOP rate limiting system  
✅ **Tested**: All endpoints have rate limiting  
✅ **Headers**: Standard HTTP rate limit headers  
✅ **Errors**: Proper 429 responses with retry info  
✅ **Logging**: Comprehensive logging for monitoring  
✅ **Documentation**: Complete usage guide  

The rate limiting system is production-ready and follows industry best practices for API rate limiting.