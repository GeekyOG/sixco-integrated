/**
 * Permission utility functions
 * Permissions are stored in localStorage under userData.permissions
 */

import { useAuth } from "../context/AuthContext";

export interface UserData {
  permissions?: string[];
  [key: string]: any;
}

/**
 * Get user data from localStorage
 */
export const getUserData = (): UserData | null => {
  const userDataRaw = localStorage.getItem("userData");
  return userDataRaw ? JSON.parse(userDataRaw) : null;
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (permission: string): boolean => {
  const { userData } = useAuth();
  if (
    !userData ||
    !userData.permissions ||
    !Array.isArray(userData.permissions)
  ) {
    return false;
  }
  return userData.permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (permissions: string[]): boolean => {
  return permissions.some((perm) => hasPermission(perm));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (permissions: string[]): boolean => {
  return permissions.every((perm) => hasPermission(perm));
};

/**
 * Get all user permissions
 */
export const getUserPermissions = (): string[] => {
  const { userData } = useAuth();
  return userData?.permissions || [];
};

/**
 * Specific permission checkers for  operations
 */
// Client
export const canCreateClient = () => hasPermission("client:create");
export const canReadClient = () => hasPermission("client:read");
export const canUpdateClient = () => hasPermission("client:update");
export const canDeleteClient = () => hasPermission("client:delete");

// Document
export const canCreateDocument = () => hasPermission("document:create");
export const canReadDocument = () => hasPermission("document:read");
export const canUpdateDocument = () => hasPermission("document:update");
export const canDeleteDocument = () => hasPermission("document:delete");

// HSE
export const canCreateHSE = () => hasPermission("hse:create");
export const canReadHSE = () => hasPermission("hse:read");
export const canUpdateHSE = () => hasPermission("hse:update");
export const canDeleteHSE = () => hasPermission("hse:delete");

// HSE Document
export const canCreateHseDocument = () => hasPermission("hsedocument:create");
export const canReadHseDocument = () => hasPermission("hsedocument:read");
export const canUpdateHseDocument = () => hasPermission("hsedocument:update");
export const canDeleteHseDocument = () => hasPermission("hsedocument:delete");

// Leave
export const canCreateLeave = () => hasPermission("leave:create");
export const canReadLeave = () => hasPermission("leave:read");
export const canUpdateLeave = () => hasPermission("leave:update");
export const canDeleteLeave = () => hasPermission("leave:delete");

// Project
export const canCreateProject = () => hasPermission("project:create");
export const canReadProject = () => hasPermission("project:read");
export const canUpdateProject = () => hasPermission("project:update");
export const canDeleteProject = () => hasPermission("project:delete");

// Report
export const canCreateReport = () => hasPermission("report:create");
export const canReadReport = () => hasPermission("report:read");
export const canUpdateReport = () => hasPermission("report:update");
export const canDeleteReport = () => hasPermission("report:delete");

// Role
export const canCreateRole = () => hasPermission("role:create");
export const canReadRole = () => hasPermission("role:read");
export const canUpdateRole = () => hasPermission("role:update");
export const canDeleteRole = () => hasPermission("role:delete");

// Task
export const canCreateTask = () => hasPermission("task:create");
export const canReadTask = () => hasPermission("task:read");
export const canUpdateTask = () => hasPermission("task:update");
export const canDeleteTask = () => hasPermission("task:delete");

// Team
export const canCreateTeam = () => hasPermission("team:create");
export const canReadTeam = () => hasPermission("team:read");
export const canUpdateTeam = () => hasPermission("team:update");
export const canDeleteTeam = () => hasPermission("team:delete");

// User
export const canCreateUser = () => hasPermission("user:create");
export const canReadUser = () => hasPermission("user:read");
export const canUpdateUser = () => hasPermission("user:update");
export const canDeleteUser = () => hasPermission("user:delete");

// Worklog
export const canCreateWorklog = () => hasPermission("worklog:create");
export const canReadWorklog = () => hasPermission("worklog:read");
export const canUpdateWorklog = () => hasPermission("worklog:update");
export const canDeleteWorklog = () => hasPermission("worklog:delete");
