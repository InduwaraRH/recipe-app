import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
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
    return Promise.reject(error)
  }
)

export default client
