import { INVENTORY_ITEMS } from '../data/mockData.js';

export const EMPTY_ORDER_FORM = {
  title: '',
  priority: 'Medium',
  expiryDate: '',
  notes: '',
  items: [{ name: INVENTORY_ITEMS[0], quantity: 1 }]
};

export const ACTIVE_SUBMITTED_STATUSES = new Set(['SUBMITTED']);

export const CREATOR_EDITABLE_STATUSES = new Set(['DRAFT', 'SENT_BACK']);

export const ORDER_STATUS_FILTERS = [
  'ALL',
  'DRAFT',
  'SUBMITTED',
  'SENT_BACK',
  'COMPLETED',
  'REJECTED'
];
