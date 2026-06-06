/**
 * Mock Workspaces Data
 * Simulates multiple business workspaces for a user account
 */

export interface Workspace {
  id: string;
  name: string;
  businessId: string;
  initials: string;
  isTestMode: boolean;
  createdAt: string;
  lastAccessed: string;
}

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "ws_001",
    name: "The Good Deeds",
    businessId: "1825719",
    initials: "TG",
    isTestMode: true,
    createdAt: "2024-01-15",
    lastAccessed: "2024-06-06",
  },
  {
    id: "ws_002",
    name: "Namibra Solutions",
    businessId: "2047583",
    initials: "NS",
    isTestMode: false,
    createdAt: "2023-08-22",
    lastAccessed: "2024-06-05",
  },
  {
    id: "ws_003",
    name: "Tech Innovations Ltd",
    businessId: "1956432",
    initials: "TI",
    isTestMode: true,
    createdAt: "2024-03-10",
    lastAccessed: "2024-06-01",
  },
];

// Current active workspace
export let CURRENT_WORKSPACE_ID = "ws_001";

export function setCurrentWorkspace(workspaceId: string) {
  CURRENT_WORKSPACE_ID = workspaceId;
}

export function getCurrentWorkspace(): Workspace {
  return MOCK_WORKSPACES.find(ws => ws.id === CURRENT_WORKSPACE_ID) || MOCK_WORKSPACES[0];
}

export function getOtherWorkspaces(): Workspace[] {
  return MOCK_WORKSPACES.filter(ws => ws.id !== CURRENT_WORKSPACE_ID);
}
