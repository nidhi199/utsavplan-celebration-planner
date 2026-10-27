/**
 * Google Gemini provider client for celebration ideas.
 * Calls Gemini REST endpoint with timeout and response normalization.
 */

async function executeGeminiRequest(model, apiKey, prompt, timeoutMs) {
  const cleanModel = String(model || 'gemini-3.5-flash').trim().replace(/^models\//, '');
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cleanModel)}:generateContent`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      const err = new Error(`Gemini API error: HTTP ${response.status} ${errText}`);
      err.status = response.status;
      err.retryAfter = response.headers.get('retry-after');
      throw err;
    }

    const json = await response.json();
    return json;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      const timeoutErr = new Error(`TIMEOUT: Gemini call exceeded ${timeoutMs}ms`);
      timeoutErr.status = 408;
      throw timeoutErr;
    }
    throw err;
  }
}

export async function callGemini(prompt, { apiKey, model = 'gemini-3.5-flash', timeoutMs = 8000 } = {}) {
  if (!apiKey) {
    throw new Error('MISSING_KEY: Gemini API key not configured.');
  }

  let json;
  try {
    json = await executeGeminiRequest(model, apiKey, prompt, timeoutMs);
  } catch (err) {
    // If a non-standard model name resulted in 404 Not Found, retry with the supported gemini-3.5-flash model
    const cleanModel = String(model).replace(/^models\//, '');
    if (err.status === 404 && cleanModel !== 'gemini-3.5-flash') {
      console.warn(`[Gemini] Model ${cleanModel} returned 404. Retrying with gemini-3.5-flash...`);
      json = await executeGeminiRequest('gemini-3.5-flash', apiKey, prompt, timeoutMs);
    } else {
      throw err;
    }
  }

  const candidate = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidate) {
    const err = new Error('UNUSABLE_OUTPUT: Empty response from Gemini');
    err.status = 502;
    throw err;
  }

  let parsed;
  try {
    parsed = JSON.parse(candidate);
  } catch {
    // Fallback regex extract JSON array
    const match = candidate.match(/\[\s*".*"\s*\]/s);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      const err = new Error('UNUSABLE_OUTPUT: Could not parse JSON array from Gemini');
      err.status = 502;
      throw err;
    }
  }

  // Normalized items
  let list = Array.isArray(parsed) ? parsed : (parsed.ideas || parsed.items || []);
  if (!Array.isArray(list) || list.length === 0) {
    const err = new Error('UNUSABLE_OUTPUT: Output is not a valid list');
    err.status = 502;
    throw err;
  }

  return list
    .map(item => (typeof item === 'string' ? item : item.idea || item.title || JSON.stringify(item)))
    .map(s => s.trim().replace(/^[-*•\d.\s]+/, ''))
    .filter(Boolean)
    .slice(0, 5)
    .map(s => (s.length > 120 ? s.slice(0, 117) + '...' : s));
}
