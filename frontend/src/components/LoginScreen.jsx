import { useEffect, useState } from 'react';
import { ClipboardList, UserRound } from 'lucide-react';
import { formatRole, initials } from '../utils/userUtils.js';

function LoginScreen({ users, error, onLogin }) {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? '');

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      setSelectedUserId(users[0].id);
    }
  }, [selectedUserId, users]);

  return (
    <main className="login-layout">
      <section className="login-panel">
        <div className="brand-row">
          <span className="brand-mark">
            <ClipboardList size={26} />
          </span>
          <div>
            <p className="eyebrow">Office Inventory</p>
            <h1>Order Management Portal</h1>
          </div>
        </div>

        <div className="login-grid">
          {users.map((user) => (
            <button
              className={`user-card ${selectedUserId === user.id ? 'selected' : ''}`}
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              type="button"
            >
              <span className="avatar">{initials(user.name)}</span>
              <span>
                <strong>{user.name}</strong>
                <small>{formatRole(user.role)} · {user.department}</small>
              </span>
            </button>
          ))}
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="primary-button wide" onClick={() => onLogin(selectedUserId)} type="button">
          <UserRound size={18} />
          Login
        </button>
      </section>
    </main>
  );
}

export default LoginScreen;
