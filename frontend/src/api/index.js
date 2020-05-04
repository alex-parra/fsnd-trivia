const API = process.env.REACT_APP_API_URL;

export default {
  getQuestions: async (page = 1) => {
    const r = await fetch(`${API}/questions?page=${page}`).catch(() => ({ ok: false }));
    if (!r.ok) throw new Error('Failed to fetch questions');
    return r.json();
  },
};
