import { cookies } from 'next/headers'

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  const cookieStore = await cookies()
  const token = cookieStore.get('codefit_token')?.value

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers
  })

  return response
}
