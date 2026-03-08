function Notification({ error, success, onClose }) {
  if (!error && !success) {
    return null;
  }

  const isError = Boolean(error);

  return (
    <div className={isError ? 'error-notification' : 'success-notification'}>
      <span className="error-icon">{isError ? '⚠' : '✓'}</span>
      <span className="error-message">{error || success}</span>
      <button className="error-close" onClick={onClose} type="button">
        ×
      </button>
    </div>
  );
}

export default Notification;
