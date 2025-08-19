import axios from 'axios'

// Use environment variable for production, fallback to development proxy
const baseURL = import.meta.env.VITE_API_URL || '/api'

console.log('API Base URL:', baseURL) // Debug log

const client = axios.create({
  baseURL,
  withCredentials: true, // send/receive httpOnly cookies
  headers: { 'Content-Type': 'application/json' }
})

// Add request interceptor for debugging
client.interceptors.request.use(request => {
  console.log('Making request to:', request.url)
  console.log('Full URL:', request.baseURL + request.url)
  console.log('Request data:', request.data)
  return request
})

// Add response interceptor for debugging
client.interceptors.response.use(
  response => {
    console.log('Response received:', response.status, response.data)
    return response
  },
  error => {
    console.log('Response error:', error.response?.status, error.response?.data)
    console.log('Error config:', error.config)
    console.log('Full error:', error)
    return Promise.reject(error)
  }
)

export default client
