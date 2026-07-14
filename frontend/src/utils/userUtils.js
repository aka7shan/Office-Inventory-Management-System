import { USERS } from '../data/mockData.js';

export function getUserById(userId) {
  return USERS.find((user) => user.id === userId);
}

export function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatRole(role) {
  return role.toLowerCase().replace('_', ' ');
}
