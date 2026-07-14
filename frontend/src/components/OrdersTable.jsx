import { ClipboardList, Eye } from 'lucide-react';
import { formatDate } from '../utils/dateUtils.js';
import StatusBadge from './common/StatusBadge.jsx';

function OrdersTable({ orders, onSelectOrder }) {
  if (orders.length === 0) {
    return (
      <section className="empty-state">
        <ClipboardList size={44} />
        <h3>No requests found</h3>
        <p>Try another status filter or search term.</p>
      </section>
    );
  }

  return (
    <section className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Request</th>
            <th>Creator</th>
            <th>Items</th>
            <th>Expiry</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Updated</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const creator = order.creator;
            return (
              <tr key={order.id}>
                <td>
                  <strong>{order.id}</strong>
                  <small>{order.title}</small>
                </td>
                <td>{creator?.name ?? 'Unknown'}</td>
                <td>{order.items.length} item{order.items.length === 1 ? '' : 's'}</td>
                <td>{formatDate(order.expiryDate)}</td>
                <td>{order.priority}</td>
                <td><StatusBadge status={order.status} /></td>
                <td>{formatDate(order.updatedAt)}</td>
                <td>
                  <button className="icon-button" onClick={() => onSelectOrder(order.id)} title="View request" type="button">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default OrdersTable;
