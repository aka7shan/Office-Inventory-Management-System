import { STATUS_META } from '../../data/mockData.js';

function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return <span className={`status-badge ${meta.tone}`}>{meta.label}</span>;
}

export default StatusBadge;
