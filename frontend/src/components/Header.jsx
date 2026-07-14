import { Search } from 'lucide-react';
import { formatRole } from '../utils/userUtils.js';

function Header({ currentUser, searchTerm, onSearchChange, orderCount }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{formatRole(currentUser.role)} Dashboard</p>
        <h2>{currentUser.role === 'CREATOR' ? 'My Requests' : 'Procurement Queue'}</h2>
      </div>
      <div className="header-tools">
        <label className="search-field">
          <Search size={17} />
          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search requests, items, creator"
          />
        </label>
        <span className="metric-pill">{orderCount} visible</span>
      </div>
    </header>
  );
}

export default Header;
