import React, { useState } from 'react';
import styles from './AckModal.module.css';
import { ZabbixProblem } from '../../types';

export interface AckFormData {
  message: string;
  acknowledge: boolean;
  changeSeverity: boolean;
  closeProblem: boolean;
}

interface AckModalProps {
  problem: ZabbixProblem;
  onClose: () => void;
  onSubmit: (data: AckFormData) => void;
}

export const AckModal = ({ problem: _problem, onClose, onSubmit }: AckModalProps) => {
  const [message, setMessage] = useState('');
  const [acknowledge, setAcknowledge] = useState(true);
  const [changeSeverity, setChangeSeverity] = useState(false);
  const [closeProblem, setCloseProblem] = useState(false);

  const handleSubmit = () => {
    onSubmit({ message, acknowledge, changeSeverity, closeProblem });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) { handleSubmit(); }
    if (e.key === 'Escape') { onClose(); }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Acknowledge Problem
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <textarea
            className={styles.messageInput}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            autoFocus
          />
          <span className={styles.hint}>Press Ctrl+Enter to submit</span>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={acknowledge}
                onChange={(e) => setAcknowledge(e.target.checked)} />
              <span>Acknowledge</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={changeSeverity}
                onChange={(e) => setChangeSeverity(e.target.checked)} />
              <span>Change severity</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={closeProblem}
                onChange={(e) => setCloseProblem(e.target.checked)} />
              <span>Close problem</span>
            </label>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btnUpdate} onClick={handleSubmit}>
            Update
          </button>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
