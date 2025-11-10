const BASE = 'https://jsonplaceholder.typicode.com';

export async function getTodos(limit = 10) {
  const res = await fetch(`${BASE}/todos?_limit=${limit}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getPosts(limit = 100) {
  const res = await fetch(`${BASE}/posts?_limit=${limit}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// POST: Crea un nuovo todo
export async function createTodo(payload) {
  const res = await fetch(`${BASE}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// PUT: Aggiorna completamente un todo
export async function updateTodo(id, payload) {
  const res = await fetch(`${BASE}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// PATCH: Aggiorna parzialmente un todo
export async function patchTodo(id, payload) {
  const res = await fetch(`${BASE}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// DELETE: Elimina un todo
export async function deleteTodo(id) {
  const res = await fetch(`${BASE}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
