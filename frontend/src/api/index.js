const API = process.env.REACT_APP_API_URL;

export default {
  getQuestions: async (page = 1) => {
    const r = await fetch(`${API}/questions?page=${page}`).catch(() => ({ ok: false }));
    if (!r.ok) throw new Error('Failed to fetch questions');
    return r.json();
  },

  deleteQuestion: async (questionId) => {
    return fetch(`${API}/questions/${questionId}`, { method: 'DELETE' });
  },

  getCategoryQuestions: async (id) => {
    const r = await fetch(`${API}/category/${id}/questions`).catch(() => ({ ok: false }));
    if (!r.ok) throw new Error('Failed to fetch questions');
    return r.json();
  },
};
