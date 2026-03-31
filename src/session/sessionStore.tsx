import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { SessionAction, SessionState } from './sessionTypes';
import { defaultCharacterTransform, defaultSessionState } from './sessionTypes';

type SessionContextValue = {
  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'setReferenceImage': {
      return { ...state, referenceImageUri: action.uri };
    }
    case 'setReferenceOpacity': {
      return { ...state, referenceOpacity: clamp(action.opacity, 0, 1) };
    }
    case 'toggleGrid': {
      return { ...state, showGrid: !state.showGrid };
    }
    case 'setBackgroundImage': {
      // 新背景意味着开始一次新的“合成会话”
      return {
        ...state,
        backgroundImageUri: action.uri,
        characterImageUri: null,
        characterTransform: defaultCharacterTransform,
      };
    }
    case 'setCharacterImage': {
      return {
        ...state,
        characterImageUri: action.uri,
        characterTransform: defaultCharacterTransform,
      };
    }
    case 'setCharacterTransform': {
      return { ...state, characterTransform: action.transform };
    }
    case 'resetCharacterTransform': {
      return { ...state, characterTransform: defaultCharacterTransform };
    }
    case 'setExportSettings': {
      return { ...state, exportSettings: action.settings };
    }
    case 'resetSession': {
      return defaultSessionState;
    }
    default: {
      const exhaustiveCheck: never = action;
      return state;
    }
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, defaultSessionState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession 必须在 SessionProvider 内使用');
  }
  return ctx;
}

