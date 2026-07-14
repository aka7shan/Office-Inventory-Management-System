import { ClipboardList, KeyRound, LogOut, PackagePlus } from 'lucide-react';
import { ORDER_STATUS_FILTERS } from '../constants/orderConstants.js';
import { STATUS_META } from '../data/mockData.js';
import { formatRole, initials } from '../utils/userUtils.js';

function Sidebar({
  currentUser,
  activeStatus,
  statusCounts,
  onStatusChange,
  onCreate,
  onChangePassword,
  onLogout
}) {
  const visibleFilters = currentUser.role === 'CREATOR'
    ? ORDER_STATUS_FILTERS
    : ORDER_STATUS_FILTERS.filter((status) => status !== 'DRAFT');

  return (
    <aside className="sidebar">
      <div className="brand-row compact">
        <span className="brand-mark">
          <ClipboardList size={22} />
        </span>
        <div>
          <strong>Office OMS</strong>
          <small>{formatRole(currentUser.role)} Workspace</small>
        </div>
      </div>

      <div className="profile-block">
        <span className="avatar large">{initials(currentUser.name)}</span>
        <div>
          <strong>{currentUser.name}</strong>
          <small>{currentUser.email}</small>
          <small>{currentUser.department}</small>
        </div>
      </div>

      {currentUser.role === 'CREATOR' && (
        <button className="primary-button" onClick={onCreate} type="button">
          <PackagePlus size={18} />
          New Request
        </button>
      )}

      <nav className="status-nav" aria-label="Request status filters">
        {visibleFilters.map((status) => (
          <button
            className={activeStatus === status ? 'active' : ''}
            key={status}
            onClick={() => onStatusChange(status)}
            type="button"
          >
            <span>{status === 'ALL' ? 'All Requests' : STATUS_META[status].label}</span>
            <small>{statusCounts[status] ?? 0}</small>
          </button>
        ))}
      </nav>

      <div className="sidebar-actions">
        <button className="ghost-button" onClick={onChangePassword} type="button">
          <KeyRound size={17} />
          Change Password
        </button>
        <button className="ghost-button" onClick={onLogout} type="button">
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
