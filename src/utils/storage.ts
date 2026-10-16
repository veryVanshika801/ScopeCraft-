import { ProposalData, UserSession } from '../types/proposal';

const SESSION_KEY = 'scopecraft_session_v1';
const PROPOSALS_KEY = 'scopecraft_proposals_v1';

export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read session:', e);
    return null;
  }
}

export function saveSession(session: UserSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
}

export function getStoredProposals(): ProposalData[] {
  try {
    const raw = localStorage.getItem(PROPOSALS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read proposals:', e);
    return [];
  }
}

export function saveProposalToStorage(proposal: ProposalData): void {
  try {
    const existing = getStoredProposals();
    const index = existing.findIndex((p) => p.id === proposal.id);
    const updated = { ...proposal, updatedAt: new Date().toISOString() };

    let newList: ProposalData[];
    if (index >= 0) {
      newList = [...existing];
      newList[index] = updated;
    } else {
      newList = [updated, ...existing];
    }

    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(newList));
  } catch (e) {
    console.error('Failed to save proposal:', e);
  }
}

export function deleteProposalFromStorage(id: string): void {
  try {
    const existing = getStoredProposals();
    const filtered = existing.filter((p) => p.id !== id);
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete proposal:', e);
  }
}
