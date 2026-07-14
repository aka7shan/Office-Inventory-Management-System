export const USERS = [
  {
    id: 'u-1001',
    name: 'Akarshan Sharma',
    email: 'akarshan.creator@office.local',
    role: 'CREATOR',
    department: 'Engineering',
    phone: '+91 98765 10001'
  },
  {
    id: 'u-1002',
    name: 'Arjun Mehta',
    email: 'arjun.creator@office.local',
    role: 'CREATOR',
    department: 'Operations',
    phone: '+91 98765 10002'
  },
  {
    id: 'u-2001',
    name: 'Priya Nair',
    email: 'priya.purchaser@office.local',
    role: 'PURCHASER',
    department: 'Procurement',
    phone: '+91 98765 20001'
  },
  {
    id: 'u-3001',
    name: 'Sameer Khan',
    email: 'sameer.manager@office.local',
    role: 'MANAGER',
    department: 'Administration',
    phone: '+91 98765 30001'
  }
];

export const INVENTORY_ITEMS = [
  'A4 Paper Ream',
  'Whiteboard Markers',
  'Laptop Stand',
  'Ergonomic Chair',
  'USB-C Hub',
  'Sticky Notes',
  'Printer Toner',
  'Desk Organizer',
  'Wireless Mouse',
  'Conference Speaker'
];

export const INITIAL_ORDERS = [
  {
    id: 'REQ-1042',
    title: 'Engineering onboarding supplies',
    creatorId: 'u-1001',
    status: 'DRAFT',
    priority: 'Medium',
    expiryDate: '2026-08-15',
    createdAt: '2026-07-09',
    updatedAt: '2026-07-09',
    items: [
      { name: 'Laptop Stand', quantity: 12 },
      { name: 'USB-C Hub', quantity: 12 }
    ],
    notes: 'For new engineering hires joining next month.',
    transactionReference: '',
    purchaserNote: ''
  },
  {
    id: 'REQ-1043',
    title: 'Monthly pantry stationery',
    creatorId: 'u-1002',
    status: 'SUBMITTED',
    priority: 'High',
    expiryDate: '2026-07-25',
    createdAt: '2026-07-11',
    updatedAt: '2026-07-12',
    items: [
      { name: 'A4 Paper Ream', quantity: 40 },
      { name: 'Whiteboard Markers', quantity: 25 }
    ],
    notes: 'Needed before the audit preparation cycle.',
    transactionReference: '',
    purchaserNote: ''
  },
  {
    id: 'REQ-1044',
    title: 'Procurement for admin seating',
    creatorId: 'u-1001',
    status: 'SENT_BACK',
    priority: 'Low',
    expiryDate: '2026-08-01',
    createdAt: '2026-07-10',
    updatedAt: '2026-07-13',
    items: [{ name: 'Ergonomic Chair', quantity: 6 }],
    notes: 'Replacement for damaged chairs on floor 4.',
    transactionReference: '',
    purchaserNote: 'Please attach cost center confirmation before resubmitting.'
  },
  {
    id: 'REQ-1045',
    title: 'Printer supplies for finance',
    creatorId: 'u-1002',
    status: 'COMPLETED',
    priority: 'Medium',
    expiryDate: '2026-07-20',
    createdAt: '2026-07-03',
    updatedAt: '2026-07-08',
    items: [{ name: 'Printer Toner', quantity: 8 }],
    notes: 'Finance printer toner refill.',
    transactionReference: 'PO-77821',
    purchaserNote: 'Completed through offline procurement.'
  },
  {
    id: 'REQ-1046',
    title: 'Desk accessories refresh',
    creatorId: 'u-1001',
    status: 'REJECTED',
    priority: 'Low',
    expiryDate: '2026-07-29',
    createdAt: '2026-07-05',
    updatedAt: '2026-07-06',
    items: [
      { name: 'Desk Organizer', quantity: 20 },
      { name: 'Sticky Notes', quantity: 30 }
    ],
    notes: 'General desk accessories.',
    transactionReference: '',
    purchaserNote: 'Rejected because the same category was fulfilled last week.'
  }
];

export const STATUS_META = {
  DRAFT: { label: 'Draft', tone: 'neutral' },
  SUBMITTED: { label: 'Submitted', tone: 'info' },
  SENT_BACK: { label: 'Sent Back', tone: 'warning' },
  COMPLETED: { label: 'Completed', tone: 'success' },
  REJECTED: { label: 'Rejected', tone: 'danger' }
};
