const API = process.env.REACT_APP_API_URL;

const acceptJson = { 'Content-Type': 'application/json' };

const getJson = () => ({
  method: 'GET',
  headers: { ...acceptJson },
});

const postJson = (data) => ({
  method: 'POST',
  headers: { ...acceptJson },
  body: JSON.stringify(data),
});

export default {
  getCategories: async () => {
    const r = await fetch(`${API}/categories`, getJson()).catch(() => ({ ok: false }));
    if (!r.ok) throw new Error('Failed to fetch categories');
    return r.json();
  },

  getQuestions: async (page = 1) => {
    const r = await fetch(`${API}/questions?page=${page}`, getJson()).catch(() => ({ ok: false }));
    if (!r.ok) throw new Error('Failed to fetch questions');
    return r.json();
  },

  addQuestion: async (data) => {
    const r = await fetch(`${API}/questions`, postJson(data)).catch(() => ({ ok: false }));
    if (!r.ok) throw new Error('Failed to add question');
    return r.json();
  },

  deleteQuestion: async (questionId) => {
    return fetch(`${API}/questions/${questionId}`, { method: 'DELETE', headers: { ...acceptJson } });
  },

  getCategoryQuestions: async (id) => {
    const r = await fetch(`${API}/category/${id}/questions`, getJson()).catch(() => ({ ok: false }));
    if (!r.ok) throw new Error('Failed to fetch questions');
    return r.json();
  },
};
