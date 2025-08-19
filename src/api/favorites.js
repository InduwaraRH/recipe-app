import client from './client.js'

export async function list() {
  const { data } = await client.get('/favorites')
  return data
}
export async function add(payload) {
  const { data } = await client.post('/favorites', payload)
  return data
}
export async function remove(id) {
  const { data } = await client.delete(`/favorites/${id}`)
  return data
}
