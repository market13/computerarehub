/**
 * Helper to submit forms to Netlify Forms (or fallback backend)
 * Sends a real POST request with URL-encoded form data.
 */
export async function submitToNetlify(formName, data) {
  const params = new URLSearchParams();
  params.append('form-name', formName);

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, String(value));
      }
    }
  });

  const response = await fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
    body: params.toString()
  });

  // Netlify Forms returns 200, 302, 303, or 204 on success
  if (!response.ok && response.status !== 302 && response.status !== 303 && response.status !== 204) {
    throw new Error(`Form submission failed with status: ${response.status}`);
  }

  return true;
}
