const API_URL = 'https://gmail-agent-production-ba37.up.railway.app';

export const api = {
  // Proposals
  async getProposals() {
    const res = await fetch(`${API_URL}/api/proposals`);
    return res.json();
  },

  async approveProposal(id: string) {
    const res = await fetch(`${API_URL}/api/proposals/${id}/approve`, { method: 'POST' });
    return res.json();
  },

  async rejectProposal(id: string) {
    const res = await fetch(`${API_URL}/api/proposals/${id}/reject`, { method: 'POST' });
    return res.json();
  },

  // Rules
  async getRules() {
    const res = await fetch(`${API_URL}/api/rules`);
    return res.json();
  },

  async createRule(rule: any) {
    const res = await fetch(`${API_URL}/api/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule)
    });
    return res.json();
  },

  async pauseRule(id: string) {
    const res = await fetch(`${API_URL}/api/rules/${id}/pause`, { method: 'POST' });
    return res.json();
  },

  async deleteRule(id: string) {
    const res = await fetch(`${API_URL}/api/rules/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Emails
  async getEmails() {
    const res = await fetch(`${API_URL}/api/emails`);
    return res.json();
  },

  // Stats
  async getStats() {
    const res = await fetch(`${API_URL}/api/stats`);
    return res.json();
  }
};
