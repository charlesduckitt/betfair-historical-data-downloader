import { AuthCredentials, AppState, WorkerState, LogEntry } from '../types';

// NOTE: In the real "London Bundle", this service points to the Python FastAPI backend.
// For this frontend artifact, we will simulate the backend responses to ensure the UI is fully functional and reviewable.

const MOCK_DELAY = 300;
const IS_DEMO_MODE = true; // Set to false when connecting to real Python backend

let mockState: WorkerState = WorkerState.IDLE;
let mockStats = {
  downloadedFiles: 1420,
  parsedMarkets: 850,
  errors: 2,
  queueSize: 15400,
  diskSpaceFreeGB: 45.2,
  downloadSpeed: 12,
  activeThreads: 0,
  currentYear: '2016',
  currentMonth: 'Feb',
};

const generateMockLog = (): LogEntry => ({
  id: Math.random().toString(36).substr(2, 9),
  timestamp: new Date().toISOString(),
  level: Math.random() > 0.9 ? 'WARN' : 'INFO',
  message: `[Worker-${Math.floor(Math.random() * 8)}] Processing 1.12345678.bz2...`
});

export const api = {
  login: async (creds: AuthCredentials): Promise<{ success: boolean; message?: string }> => {
    if (IS_DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (!creds.appKey || !creds.ssoid) {
        return { success: false, message: 'Missing credentials' };
      }
      return { success: true };
    }
    // Real Implementation:
    // const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify(creds) });
    // return res.json();
    return { success: true };
  },

  start: async (): Promise<void> => {
    if (IS_DEMO_MODE) {
      mockState = WorkerState.RUNNING;
      mockStats.activeThreads = 8;
    } else {
      await fetch('/api/control/start', { method: 'POST' });
    }
  },

  pause: async (): Promise<void> => {
    if (IS_DEMO_MODE) {
      mockState = WorkerState.PAUSED;
      mockStats.activeThreads = 0;
    } else {
      await fetch('/api/control/pause', { method: 'POST' });
    }
  },

  resume: async (): Promise<void> => {
    if (IS_DEMO_MODE) {
      mockState = WorkerState.RUNNING;
      mockStats.activeThreads = 8;
    } else {
      await fetch('/api/control/resume', { method: 'POST' });
    }
  },

  stop: async (): Promise<void> => {
    if (IS_DEMO_MODE) {
      mockState = WorkerState.IDLE;
      mockStats.activeThreads = 0;
    } else {
      await fetch('/api/control/stop', { method: 'POST' });
    }
  },

  pollStatus: async (): Promise<Partial<AppState>> => {
    if (IS_DEMO_MODE) {
      // Simulate changing stats
      if (mockState === WorkerState.RUNNING) {
        mockStats.downloadedFiles += Math.floor(Math.random() * 5);
        mockStats.parsedMarkets += Math.floor(Math.random() * 5);
        mockStats.diskSpaceFreeGB -= 0.001;
      }
      
      const newLogs = mockState === WorkerState.RUNNING && Math.random() > 0.5 
        ? [generateMockLog()] 
        : [];

      return {
        status: mockState,
        stats: { ...mockStats },
        logs: newLogs
      };
    } else {
      const res = await fetch('/api/status');
      return res.json();
    }
  }
};