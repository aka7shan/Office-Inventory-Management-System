import { ACTIVE_SUBMITTED_STATUSES } from '../constants/orderConstants.js';
import { startOfToday } from './dateUtils.js';

export function validateOrderForm(form, targetStatus, orders, editingOrderId) {
  if (!form.title.trim()) {
    return 'Request title is required.';
  }
  if (!form.expiryDate) {
    return 'Expiry date is required.';
  }
  if (new Date(form.expiryDate) < startOfToday()) {
    return 'Expiry date cannot be in the past.';
  }
  if (form.items.length === 0) {
    return 'At least one item is required.';
  }

  const itemNames = form.items.map((item) => item.name);
  if (new Set(itemNames).size !== itemNames.length) {
    return 'Duplicate items are not allowed in the same request.';
  }

  const invalidItem = form.items.find((item) => !item.name || Number(item.quantity) <= 0);
  if (invalidItem) {
    return 'Each item must have a valid name and quantity greater than zero.';
  }

  if (targetStatus === 'SUBMITTED') {
    const conflictingOrder = orders.find((order) => {
      if (order.id === editingOrderId || !ACTIVE_SUBMITTED_STATUSES.has(order.status)) {
        return false;
      }
      return order.items.some((existingItem) => itemNames.includes(existingItem.name));
    });

    if (conflictingOrder) {
      return `Cannot submit because one or more items already exist in submitted request ${conflictingOrder.id}.`;
    }
  }

  return '';
}
