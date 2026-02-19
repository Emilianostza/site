/**
 * Netlify Function: Gemini API Proxy
 *
 * This function proxies requests to the Google Gemini API on the server side,
 * keeping the API key secure and never exposing it to the client.
 *
 * Requires:
 * - GEMINI_API_KEY: Google Gemini API key (Netlify env)
 * - VITE_SUPABASE_URL: Supabase project URL (Netlify env)
 * - SUPABASE_SERVICE_ROLE_KEY: Supabase service role key for server-side auth validation
 *
 * Usage (from authenticated frontend):
 * const response = await fetch('/.netlify/functions/gemini-proxy', {
 *   method: 'POST',
 *   headers: { Authorization: `Bearer ${token}` },
 *   body: JSON.stringify({ prompt: '...' })
 * });
 */

import { createClient } from '@supabase/supabase-js';

type Handler = (event: any) => Promise<{ statusCode: number; body: string }>;

const GEMINI_API_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const MAX_PROMPT_BYTES = 8192; // 8 KB

interface GeminiRequest {
  prompt: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // ── Auth: validate Supabase JWT ──────────────────────────────────────────────
  const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!bearerToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Authentication required' }),
    };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[Gemini Proxy] Supabase config missing');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: authData, error: authError } = await supabase.auth.getUser(bearerToken);

  if (authError || !authData?.user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid or expired token' }),
    };
  }

  // ── Parse and validate body ──────────────────────────────────────────────────
  let parsed: GeminiRequest;
  try {
    parsed = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { prompt } = parsed;

  if (!prompt || typeof prompt !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing or invalid prompt parameter' }),
    };
  }

  if (new Blob([prompt]).size > MAX_PROMPT_BYTES) {
    return {
      statusCode: 413,
      body: JSON.stringify({ error: 'Prompt exceeds maximum allowed size (8 KB)' }),
    };
  }

  // ── Gemini API call ──────────────────────────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[Gemini Proxy] GEMINI_API_KEY not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      console.error('[Gemini Proxy] Gemini API returned', response.status);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Upstream API error' }),
      };
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return {
      statusCode: 200,
      body: JSON.stringify({ result: text }),
    };
  } catch (err) {
    console.error('[Gemini Proxy] Exception:', err instanceof Error ? err.message : err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
