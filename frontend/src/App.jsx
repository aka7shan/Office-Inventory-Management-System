import { useEffect, useMemo, useState } from 'react';
import {
  completeOrder,
  createOrder,
  fetchOrders,
  fetchUsers,
  login,
  rejectOrder,
  sendBackOrder,
  updateOrder
} from './api/apiClient.js';
import ChangePasswordDialog from './components/ChangePasswordDialog.jsx';
import Header from './components/Header.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import OrderDetails from './components/OrderDetails.jsx';
import OrderForm from './components/OrderForm.jsx';
import OrdersTable from './components/OrdersTable.jsx';
import Sidebar from './components/Sidebar.jsx';
import { EMPTY_ORDER_FORM } from './constants/orderConstants.js';
import { USERS } from './data/mockData.js';
import { validateOrderForm } from './utils/orderValidation.js';

function App() {
  const [users, setUsers] = useState(USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_ORDER_FORM);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setPageError('Backend is not reachable yet. Start the backend on port 8081 and refresh.'));
  }, []);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  const visibleOrders = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return orders
      .filter((order) => isOrderVisibleForRole(order, currentUser))
      .filter((order) => activeStatus === 'ALL' || order.status === activeStatus)
      .filter((order) => matchesSearch(order, searchTerm))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [activeStatus, currentUser, orders, searchTerm]);

  const statusCounts = useMemo(() => {
    const baseOrders = currentUser?.role === 'CREATOR'
      ? orders.filter((order) => order.creatorId === currentUser.id)
      : orders.filter((order) => order.status !== 'DRAFT');

    return baseOrders.reduce(
      (accumulator, order) => ({
        ...accumulator,
        [order.status]: (accumulator[order.status] ?? 0) + 1,
        ALL: accumulator.ALL + 1
      }),
      { ALL: 0 }
    );
  }, [currentUser, orders]);

  async function handleLogin(userId) {
    try {
      setIsLoading(true);
      setPageError('');
      const authenticatedUser = await login(userId);
      const userOrders = await fetchOrders(userId);
      setCurrentUser(authenticatedUser);
      setOrders(userOrders);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setIsLoading(false);
    }
    setSelectedOrderId(null);
    setActiveStatus('ALL');
    setSearchTerm('');
    setIsCreating(false);
  }

  function startCreateOrder() {
    setForm(EMPTY_ORDER_FORM);
    setFormError('');
    setSelectedOrderId(null);
    setIsCreating(true);
  }

  function startEditOrder(order) {
    setForm({
      title: order.title,
      priority: order.priority,
      expiryDate: order.expiryDate,
      notes: order.notes,
      items: order.items.map((item) => ({ ...item }))
    });
    setFormError('');
    setIsCreating(true);
    setSelectedOrderId(order.id);
  }

  async function saveOrder(targetStatus) {
    if (!currentUser) {
      return;
    }

    const validationError = validateOrderForm(form, targetStatus, orders, selectedOrderId);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setPageError('');
      const savedOrder = selectedOrder
        ? await updateOrder(selectedOrder.numericId, currentUser.id, targetStatus, form)
        : await createOrder(currentUser.id, targetStatus, form);

      await refreshOrders(savedOrder.id);
      setIsCreating(false);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updatePurchaserDecision(orderNumericId, status, fields) {
    if (!currentUser) {
      return;
    }

    try {
      setIsLoading(true);
      setPageError('');
      const updatedOrder = await submitPurchaserDecision(orderNumericId, status, fields);
      await refreshOrders(updatedOrder.id);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function submitPurchaserDecision(orderNumericId, status, fields) {
    if (status === 'COMPLETED') {
      return completeOrder(orderNumericId, currentUser.id, fields.transactionReference, fields.purchaserNote);
    }
    if (status === 'REJECTED') {
      return rejectOrder(orderNumericId, currentUser.id, fields.purchaserNote);
    }
    return sendBackOrder(orderNumericId, currentUser.id, fields.purchaserNote);
  }

  async function refreshOrders(selectedId = selectedOrderId) {
    const latestOrders = await fetchOrders(currentUser.id);
    setOrders(latestOrders);
    setSelectedOrderId(selectedId);
  }

  if (!currentUser) {
    return <LoginScreen users={users} error={pageError} onLogin={handleLogin} />;
  }

  return (
    <main className="app-shell">
      <Sidebar
        currentUser={currentUser}
        activeStatus={activeStatus}
        statusCounts={statusCounts}
        onStatusChange={setActiveStatus}
        onCreate={startCreateOrder}
        onChangePassword={() => setChangePasswordOpen(true)}
        onLogout={() => setCurrentUser(null)}
      />

      <section className="content">
        <Header
          currentUser={currentUser}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          orderCount={visibleOrders.length}
        />

        {pageError && <div className="inline-error page-error">{pageError}</div>}
        {isLoading && <div className="loading-bar">Syncing with backend...</div>}

        {isCreating ? (
          <OrderForm
            currentUser={currentUser}
            editingOrder={selectedOrder}
            form={form}
            error={formError}
            onChange={setForm}
            onCancel={() => {
              setIsCreating(false);
              setFormError('');
            }}
            onSaveDraft={() => saveOrder('DRAFT')}
            onSubmit={() => saveOrder('SUBMITTED')}
          />
        ) : selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            currentUser={currentUser}
            onBack={() => setSelectedOrderId(null)}
            onEdit={() => startEditOrder(selectedOrder)}
            onDecision={updatePurchaserDecision}
          />
        ) : (
          <OrdersTable orders={visibleOrders} onSelectOrder={setSelectedOrderId} />
        )}
      </section>

      {changePasswordOpen && (
        <ChangePasswordDialog onClose={() => setChangePasswordOpen(false)} />
      )}
    </main>
  );
}

function isOrderVisibleForRole(order, currentUser) {
  if (currentUser.role === 'CREATOR') {
    return order.creatorId === currentUser.id;
  }
  return order.status !== 'DRAFT';
}

function matchesSearch(order, searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) {
    return true;
  }

  const creator = order.creator;
  return [
    order.id,
    order.title,
    order.priority,
    order.status,
    creator?.name,
    ...order.items.map((item) => item.name)
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedSearch);
}

export default App;
