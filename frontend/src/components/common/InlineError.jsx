import { AlertCircle } from 'lucide-react';

function InlineError({ message }) {
  return (
    <div className="inline-error">
      <AlertCircle size={17} />
      {message}
    </div>
  );
}

export default InlineError;
