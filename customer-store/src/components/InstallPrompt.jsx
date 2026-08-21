import React, { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="pwa-install-prompt">
      <div className="d-flex align-items-center gap-3">
        <div className="app-icon-box">A</div>
        <div>
          <div className="pwa-title">ANP MART App</div>
          <div className="pwa-sub">Install for faster shopping</div>
        </div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <button className="pwa-skip" onClick={() => setVisible(false)}>Skip</button>
        <button
          className="pwa-install"
          onClick={async () => {
            if (deferredPrompt) {
              deferredPrompt.prompt();
              await deferredPrompt.userChoice;
              setDeferredPrompt(null);
              setVisible(false);
            }
          }}
        >
          Install
        </button>
      </div>
    </div>
  );
}