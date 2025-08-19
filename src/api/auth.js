import client from './client.js'

export async function register(email, password) {
  try {
    const response = await client.post('/auth/register', { email, password })
    return response.data
  } catch (error) {
    console.error('Registration error details:', error.response?.data)
    throw error
  }
}

export async function login(email, password) {
  try {
    const response = await client.post('/auth/login', { email, password })
    return response.data
  } catch (error) {
    console.error('Login error details:', error.response?.data)
    throw error
  }
}

export async function logout() {
  try {
    const response = await client.post('/auth/logout')
    return response.data
  } catch (error) {
    console.error('Logout error details:', error.response?.data)
    throw error
  }
}

export async function me() {
  try {
    const { data } = await client.get('/auth/me')
    return data.user
  } catch (error) {
    console.error('Me endpoint error details:', error.response?.data)
    throw error
  }
}
