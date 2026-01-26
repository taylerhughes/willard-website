// PM System Constants

export const ISSUE_STATUSES = {
  backlog: { label: 'Backlog', color: '#6b7280' },
  todo: { label: 'Todo', color: '#3b82f6' },
  in_progress: { label: 'In Progress', color: '#f59e0b' },
  in_review: { label: 'In Review', color: '#8b5cf6' },
  blocked: { label: 'Blocked', color: '#ef4444' },
  done: { label: 'Done', color: '#10b981' },
  cancelled: { label: 'Cancelled', color: '#6b7280' },
} as const;

export type IssueStatus = keyof typeof ISSUE_STATUSES;

export const ISSUE_PRIORITIES = {
  none: { label: 'No Priority', color: '#6b7280', icon: '○' },
  low: { label: 'Low', color: '#3b82f6', icon: '◔' },
  medium: { label: 'Medium', color: '#f59e0b', icon: '◑' },
  high: { label: 'High', color: '#ef4444', icon: '◕' },
  urgent: { label: 'Urgent', color: '#dc2626', icon: '●' },
} as const;

export type IssuePriority = keyof typeof ISSUE_PRIORITIES;

export const PROJECT_STATUSES = {
  planned: { label: 'Planned', color: '#6b7280' },
  active: { label: 'Active', color: '#10b981' },
  paused: { label: 'Paused', color: '#f59e0b' },
  completed: { label: 'Completed', color: '#3b82f6' },
  cancelled: { label: 'Cancelled', color: '#6b7280' },
} as const;

export type ProjectStatus = keyof typeof PROJECT_STATUSES;

export const PROJECT_HEALTH = {
  on_track: { label: 'On Track', color: '#10b981', icon: '✓' },
  at_risk: { label: 'At Risk', color: '#f59e0b', icon: '⚠' },
  off_track: { label: 'Off Track', color: '#ef4444', icon: '✕' },
} as const;

export type ProjectHealth = keyof typeof PROJECT_HEALTH;

export const CYCLE_STATUSES = {
  planned: { label: 'Planned', color: '#6b7280' },
  active: { label: 'Active', color: '#10b981' },
  completed: { label: 'Completed', color: '#3b82f6' },
} as const;

export type CycleStatus = keyof typeof CYCLE_STATUSES;

export const USER_ROLES = {
  admin: { label: 'Admin', description: 'Full access to all features' },
  member: { label: 'Member', description: 'Can create and edit issues and projects' },
  viewer: { label: 'Viewer', description: 'Read-only access' },
} as const;

export type UserRole = keyof typeof USER_ROLES;

export const NOTIFICATION_TYPES = {
  assigned: { label: 'Assigned to Issue', icon: '👤' },
  mentioned: { label: 'Mentioned in Comment', icon: '@' },
  status_changed: { label: 'Status Changed', icon: '🔄' },
  comment_added: { label: 'Comment Added', icon: '💬' },
  priority_changed: { label: 'Priority Changed', icon: '⚡' },
} as const;

export type NotificationType = keyof typeof NOTIFICATION_TYPES;

// Issue identifier prefix
export const ISSUE_PREFIX = 'WIL';

// Default colors for projects
export const PROJECT_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
];

// Default icons for projects
export const PROJECT_ICONS = [
  'folder',
  'star',
  'heart',
  'lightning',
  'fire',
  'sparkles',
  'rocket',
  'target',
];
