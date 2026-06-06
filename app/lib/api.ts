export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
  const headers = new Headers(options.headers)

  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (typeof window !== 'undefined') {
    const token = document.cookie.split('codefit_token=')[1]?.split(';')[0]
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  return fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers
  })
}
