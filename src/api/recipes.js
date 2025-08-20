import client from './client';

export async function getCategories() {
  const { data } = await client.get('/recipes/categories'); 
  return data; 
}
export async function listByCategory(category) {
  const { data } = await client.get('/recipes', { params: { category } });
  return data; 
}

export async function getById(id) {
  const { data } = await client.get(`/recipes/${id}`);
  const meal = Array.isArray(data?.meals) ? data.meals[0] : data;
  return meal ?? null;
}
