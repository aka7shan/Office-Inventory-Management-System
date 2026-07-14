import { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Save, XCircle } from 'lucide-react';
import { CREATOR_EDITABLE_STATUSES } from '../constants/orderConstants.js';
import { formatDate } from '../utils/dateUtils.js';
import Field from './common/Field.jsx';
import InlineError from './common/InlineError.jsx';
import StatusBadge from './common/StatusBadge.jsx';

function OrderDetails({ order, currentUser, onBack, onEdit, onDecision }) {
  const [transactionReference, setTransactionReference] = useState(order.transactionReference);
  const [purchaserNote, setPurchaserNote] = useState(order.purchaserNote);
  const [actionError, setActionError] = useState('');
  const creator = order.creator;
  const canEdit = currentUser.role === 'CREATOR'
    && currentUser.id === order.creatorId
    && CREATOR_EDITABLE_STATUSES.has(order.status);
  const canPurchase = currentUser.role === 'PURCHASER' && order.status === 'SUBMITTED';

  function completeOrder() {
    if (!transactionReference.trim()) {
      setActionError('Transaction reference is required to complete a request.');
      return;
    }
    onDecision(order.numericId, 'COMPLETED', {
      transactionReference: transactionReference.trim(),
      purchaserNote: purchaserNote.trim() || 'Completed through offline procurement.'
    });
    setActionError('');
  }

  function rejectOrder() {
    if (!purchaserNote.trim()) {
      setActionError('A rejection note is required.');
      return;
    }
    onDecision(order.numericId, 'REJECTED', { purchaserNote: purchaserNote.trim() });
    setActionError('');
  }

  function sendBackOrder() {
    if (!purchaserNote.trim()) {
      setActionError('A note is required before sending the request back.');
      return;
    }
    onDecision(order.numericId, 'SENT_BACK', { purchaserNote: purchaserNote.trim() });
    setActionError('');
  }

  return (
    <section className="details-layout">
      <div className="details-header">
        <button className="ghost-button fit" onClick={onBack} type="button">
          <ArrowLeft size={17} />
          Back
        </button>
        <StatusBadge status={order.status} />
      </div>

      <div className="details-grid">
        <article className="detail-panel main-panel">
          <div className="title-row">
            <div>
              <p className="eyebrow">{order.id}</p>
              <h2>{order.title}</h2>
            </div>
            {canEdit && (
              <button className="secondary-button" onClick={onEdit} type="button">
                <Save size={17} />
                Edit
              </button>
            )}
          </div>

          <dl className="meta-grid">
            <div>
              <dt>Creator</dt>
              <dd>{creator?.name}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{creator?.department}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>{order.priority}</dd>
            </div>
            <div>
              <dt>Expiry</dt>
              <dd>{formatDate(order.expiryDate)}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDate(order.createdAt)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDate(order.updatedAt)}</dd>
            </div>
          </dl>

          <h3>Requested Items</h3>
          <div className="items-list">
            {order.items.map((item) => (
              <div className="item-row" key={item.name}>
                <span>{item.name}</span>
                <strong>{item.quantity}</strong>
              </div>
            ))}
          </div>

          <h3>Request Notes</h3>
          <p className="note-box">{order.notes || 'No notes added.'}</p>
        </article>

        <aside className="detail-panel side-panel">
          <h3>Processing</h3>
          <Field label="Transaction Reference">
            <input
              disabled={!canPurchase}
              value={transactionReference}
              onChange={(event) => setTransactionReference(event.target.value)}
              placeholder="PO / offline transaction id"
            />
          </Field>
          <Field label="Purchaser Note">
            <textarea
              disabled={!canPurchase}
              value={purchaserNote}
              onChange={(event) => setPurchaserNote(event.target.value)}
              placeholder="Add completion, rejection, or amendment note"
              rows={5}
            />
          </Field>

          {order.purchaserNote && !canPurchase && (
            <p className="note-box compact-note">{order.purchaserNote}</p>
          )}

          {actionError && <InlineError message={actionError} />}

          {canPurchase && (
            <div className="decision-actions">
              <button className="primary-button" onClick={completeOrder} type="button">
                <CheckCircle2 size={17} />
                Complete
              </button>
              <button className="secondary-button" onClick={sendBackOrder} type="button">
                <RotateCcw size={17} />
                Send Back
              </button>
              <button className="danger-button" onClick={rejectOrder} type="button">
                <XCircle size={17} />
                Reject
              </button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default OrderDetails;
