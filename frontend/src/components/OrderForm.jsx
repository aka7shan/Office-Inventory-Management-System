import { ArrowLeft, PackagePlus, Save, Send, XCircle } from 'lucide-react';
import { INVENTORY_ITEMS } from '../data/mockData.js';
import { getTodayIsoDate } from '../utils/dateUtils.js';
import Field from './common/Field.jsx';
import InlineError from './common/InlineError.jsx';

function OrderForm({
  currentUser,
  editingOrder,
  form,
  error,
  onChange,
  onCancel,
  onSaveDraft,
  onSubmit
}) {
  const isEditing = Boolean(editingOrder);
  const canSaveDraft = !isEditing || editingOrder.status === 'DRAFT';

  function updateField(field, value) {
    onChange({ ...form, [field]: value });
  }

  function updateItem(index, field, value) {
    onChange({
      ...form,
      items: form.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    });
  }

  function addItem() {
    onChange({
      ...form,
      items: [...form.items, { name: INVENTORY_ITEMS[0], quantity: 1 }]
    });
  }

  function removeItem(index) {
    if (form.items.length === 1) {
      return;
    }
    onChange({
      ...form,
      items: form.items.filter((_, itemIndex) => itemIndex !== index)
    });
  }

  return (
    <section className="form-panel">
      <div className="details-header">
        <button className="ghost-button fit" onClick={onCancel} type="button">
          <ArrowLeft size={17} />
          Back
        </button>
        <span className="metric-pill">{currentUser.department}</span>
      </div>

      <div className="title-row">
        <div>
          <p className="eyebrow">{isEditing ? editingOrder.id : 'New Request'}</p>
          <h2>{isEditing ? 'Edit Inventory Request' : 'Create Inventory Request'}</h2>
        </div>
      </div>

      <div className="form-grid">
        <Field label="Request Title">
          <input
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Example: Engineering onboarding supplies"
          />
        </Field>
        <Field label="Priority">
          <select value={form.priority} onChange={(event) => updateField('priority', event.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </Field>
        <Field label="Expiry Date">
          <input
            min={getTodayIsoDate()}
            type="date"
            value={form.expiryDate}
            onChange={(event) => updateField('expiryDate', event.target.value)}
          />
        </Field>
      </div>

      <div className="form-section">
        <div className="section-heading">
          <h3>Items</h3>
          <button className="secondary-button fit" onClick={addItem} type="button">
            <PackagePlus size={16} />
            Add Item
          </button>
        </div>
        <div className="item-editor">
          {form.items.map((item, index) => (
            <div className="item-edit-row" key={`${item.name}-${index}`}>
              <select value={item.name} onChange={(event) => updateItem(index, 'name', event.target.value)}>
                {INVENTORY_ITEMS.map((inventoryItem) => (
                  <option key={inventoryItem}>{inventoryItem}</option>
                ))}
              </select>
              <input
                min="1"
                type="number"
                value={item.quantity}
                onChange={(event) => updateItem(index, 'quantity', event.target.value)}
              />
              <button className="icon-button danger-icon" onClick={() => removeItem(index)} title="Remove item" type="button">
                <XCircle size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Field label="Notes">
        <textarea
          rows={5}
          value={form.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          placeholder="Add business justification, floor, department, or cost center details"
        />
      </Field>

      {error && <InlineError message={error} />}

      <div className="form-actions">
        <button className="ghost-button fit" onClick={onCancel} type="button">Cancel</button>
        {canSaveDraft && (
          <button className="secondary-button" onClick={onSaveDraft} type="button">
            <Save size={17} />
            Save Draft
          </button>
        )}
        <button className="primary-button" onClick={onSubmit} type="button">
          <Send size={17} />
          Submit
        </button>
      </div>
    </section>
  );
}

export default OrderForm;
