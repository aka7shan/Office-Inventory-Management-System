import { useState } from 'react';
import { CheckCircle2, KeyRound } from 'lucide-react';
import Field from './common/Field.jsx';

function ChangePasswordDialog({ onClose }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
        <div className="title-row">
          <div>
            <p className="eyebrow">Account Security</p>
            <h2 id="change-password-title">Change Password</h2>
          </div>
        </div>
        {saved ? (
          <div className="success-box">
            <CheckCircle2 size={22} />
            Password change request captured.
          </div>
        ) : (
          <>
            <Field label="Current Password"><input type="password" /></Field>
            <Field label="New Password"><input type="password" /></Field>
            <Field label="Confirm Password"><input type="password" /></Field>
          </>
        )}
        <div className="form-actions">
          <button className="ghost-button fit" onClick={onClose} type="button">Close</button>
          {!saved && (
            <button className="primary-button" onClick={() => setSaved(true)} type="button">
              <KeyRound size={17} />
              Request Change
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default ChangePasswordDialog;
