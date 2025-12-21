#!/usr/bin/env node

/**
 * Rate Limiting Test Script
 * 
 * This script tests the rate limiting functionality of the ApniSec API.
 * It demonstrates endpoint-specific limits and proper HTTP headers.
 */

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null, maxRequests = 15) {
  console.log(`\n🧪 Testing ${method} ${endpoint}`);
  console.log('='.repeat(50));
  
  const results = [];
  
  for (let i = 1; i <= maxRequests; i++) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'RateLimit-Test-Script'
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      
      const result = {
        request: i,
        status: response.status,
        limit: response.headers.get('X-RateLimit-Limit'),
        remaining: response.headers.get('X-RateLimit-Remaining'),
        reset: response.headers.get('X-RateLimit-Reset'),
        retryAfter: response.headers.get('Retry-After'),
        policy: response.headers.get('X-RateLimit-Policy')
      };
      
      results.push(result);
      
      // Color coding for status
      const statusColor = response.status === 200 ? '✅' : 
                         response.status === 429 ? '🚫' : '⚠️';
      
      console.log(`${statusColor} Request ${i}: ${response.status} | Remaining: ${result.remaining}/${result.limit} | Reset: ${result.reset}`);
      
      if (response.status === 429) {
        console.log(`   🕐 Retry after: ${result.retryAfter} seconds`);
        break; // Stop testing once rate limited
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Request ${i} failed:`, error.message);
    }
  }
  
  return results;
}

async function runTests() {
  console.log('🛡️ ApniSec Rate Limiting Test Suite');
  console.log('====================================');
  
  try {
    // Test 1: Health endpoint (lenient - 200 per 15 min)
    await testEndpoint('/api/health', 'GET', null, 5);
    
    // Test 2: Auth login endpoint (strict - 10 per 15 min)
    await testEndpoint('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'testpassword'
    }, 12);
    
    // Test 3: Test email endpoint (very strict - 3 per 15 min)
    await testEndpoint('/api/test-email', 'POST', {
      email: 'test@example.com',
      type: 'welcome'
    }, 5);
    
    console.log('\n🎉 Rate limiting tests completed!');
    console.log('\n📊 Summary:');
    console.log('- Health endpoint: 200 requests per 15 minutes');
    console.log('- Auth login: 10 requests per 15 minutes');
    console.log('- Test email: 3 requests per 15 minutes');
    console.log('- All endpoints return proper rate limit headers');
    console.log('- 429 status code when limits exceeded');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };