/**
 * Netlify Function: Gemini API Proxy
 *
 * This function proxies requests to the Google Gemini API on the server side,
 * keeping the API key secure and never exposing it to the client.
 *
 * Deployment Note:
 * Add GEMINI_API_KEY to your Netlify environment variables (Site Settings > Build & Deploy > Environment).
 * Do NOT commit the actual key to source control.
 *
 * Usage (from frontend):
 * const response = await fetch('/.netlify/functions/gemini-proxy', {
 *   method: 'POST',
 *   body: JSON.stringify({ prompt: '...' })
 * });
 */

// Netlify Function type (no external dependency needed)
type Handler = (event: any) => Promise<{ statusCode: number; body: string }> | { statusCode: number; body: string };

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiRequest {
  prompt: string;
  [key: string]: any;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code?: number;
  };
}

const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}') as GeminiRequest;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing prompt parameter' })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[Gemini Proxy] GEMINI_API_KEY not configured in environment');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Call Gemini API (server-side, with secure key)
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const data: GeminiResponse = await response.json();

    if (!response.ok) {
      console.error('[Gemini Proxy] API error:', data.error?.message);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || 'Gemini API error'
        })
      };
    }

    // Extract response text
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      statusCode: 200,
      body: JSON.stringify({ result: text })
    };
  } catch (error) {
    console.error('[Gemini Proxy] Exception:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
};

export { handler };
