export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
}

export interface ConnectedAccount {
  user: GoogleUser;
  accessToken: string | null;
  isDemo: boolean;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  htmlLink?: string;
  attendees?: { displayName?: string; email: string; responseStatus?: string }[];
  note?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  from: string;
  subject: string;
  date: string;
  unread: boolean;
}

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  status: 'needsAction' | 'completed';
}

export interface SystemStats {
  driveUsed: number; // e.g. 14.2
  driveTotal: number; // e.g. 32.0
  allocatedPercentage: number;
  fragmentedPercentage: number;
  freePercentage: number;
}
