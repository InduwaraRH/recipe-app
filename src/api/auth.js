import client from './client.js'

export async function register(email, password) {
  const response = await client.post('/auth/register', { email, password })
  return response.data
}
export async function login(email, password) {
  await client.post('/auth/login', { email, password })
}
export async function logout() {
  await client.post('/auth/logout')
}
export async function me() {
  const { data } = await client.get('/auth/me')
  return data.user
}
