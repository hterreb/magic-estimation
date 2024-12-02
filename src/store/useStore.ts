import { create } from 'zustand';
import { Participant, Session } from '@/types/estimation';
import { estimationScales } from '@/data/estimationScales';

interface EstimationStore {
  currentUser: Participant | null;
  currentSession: Session | null;
  sessions: Session[];
  participants: Participant[]
  setCurrentUser: (user: Participant) => void;
  createSession: (name: string, moderator: Participant) => Session;
  joinSession: (sessionId: string, participant: Participant) => void;
  leaveSession: (sessionId: string, participantId: string) => void;
  getCurrentSession: () => Session | null;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  addParticipant: (participant: Participant) => void;
}

export const useStore = create<EstimationStore>((set, get) => ({
  currentUser: null,
  currentSession: null,
  sessions: [],
  participants: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  addParticipant: (participant) => {
    set((state) => ({
      participants: [...state.participants, participant],
    }));
  },
  
  createSession: (name, moderator) => {
    const session: Session = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      moderatorId: moderator.id,
      stories: [],
      participants: [moderator],
      selectedScale: estimationScales[0].name,
      isRevealed: false,
    };

    set((state) => ({
      sessions: [...state.sessions, session],
      currentSession: session,
    }));

    return session;
  },

  joinSession: (sessionId, participant) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              participants: [...session.participants, participant],
            }
          : session
      ),
      currentSession: state.currentSession?.id === sessionId
        ? {
            ...state.currentSession,
            participants: [...state.currentSession.participants, participant],
          }
        : state.currentSession,
    }));
  },

  leaveSession: (sessionId, participantId) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              participants: session.participants.filter((p) => p.id !== participantId),
            }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? null
          : state.currentSession,
    }));
  },

  getCurrentSession: () => get().currentSession,

  updateSession: (sessionId, updates) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, ...updates }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { ...state.currentSession, ...updates }
          : state.currentSession,
    }));
  },
}));