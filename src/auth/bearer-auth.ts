import { timingSafeEqual } from 'node:crypto';
import httpConfig from '../config/http-config.js';

/**
 * Timing-safe comparison of two strings to prevent timing attacks.
 */
function safeCompare(a: string, b: string): boolean {
  // Ensure both strings have the same length for timing-safe comparison
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  // If lengths differ, still perform comparison to avoid timing leak
  if (bufA.length !== bufB.length) {
    // Compare against self to maintain constant time
    timingSafeEqual(bufA, bufA);
    return false;
  }

  return timingSafeEqual(bufA, bufB);
}

/**
 * Validate a token against the configured auth tokens.
 */
function isValidToken(token: string): boolean {
  return httpConfig.authTokens.some((validToken) => safeCompare(token, validToken));
}

/**
 * FastMCP authenticate function for Bearer token authentication.
 */
export async function authenticateBearer(request: { headers: Record<string, string | string[] | undefined> }): Promise<{ authenticated: boolean }> {
  const authHeader = request.headers.authorization;
  const authValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

  if (!authValue?.startsWith('Bearer ')) {
    throw new Response(null, {
      status: 401,
      statusText: 'Bearer token required',
    });
  }

  const token = authValue.slice(7);

  if (!isValidToken(token)) {
    throw new Response(null, {
      status: 401,
      statusText: 'Invalid token',
    });
  }

  return { authenticated: true };
}
