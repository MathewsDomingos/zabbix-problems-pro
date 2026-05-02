import React, { useState } from 'react';
import { css, keyframes } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
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

const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const modalIn = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(-10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const getStyles = () => ({
  overlay: css`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: ${overlayIn} 0.2s ease;
  `,
  modal: css`
    background: #141c27;
    border: 1px solid #1e2d3d;
    border-radius: 12px;
    width: 480px;
    max-width: 90vw;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
    animation: ${modalIn} 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #1e2d3d;
  `,
  headerTitle: css`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #ccd9e6;
  `,
  closeBtn: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: #4a6178;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.15s;
    &:hover {
      background: #1a2535;
      color: #ccd9e6;
    }
  `,
  body: css`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  messageInput: css`
    width: 100%;
    background: #0a1018;
    border: 1px solid #1e2d3d;
    border-radius: 8px;
    color: #ccd9e6;
    font-size: 13px;
    padding: 10px 12px;
    resize: vertical;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
    &:focus {
      border-color: #2d6090;
    }
    &::placeholder {
      color: #3a5168;
    }
  `,
  hint: css`
    font-size: 11px;
    color: #3a5168;
    text-align: right;
  `,
  checkboxGroup: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 6px;
  `,
  checkboxLabel: css`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #7fa0c0;
    cursor: pointer;
    input[type='checkbox'] {
      width: 15px;
      height: 15px;
      accent-color: #3b82f6;
      cursor: pointer;
    }
  `,
  footer: css`
    display: flex;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid #1e2d3d;
    justify-content: flex-end;
  `,
  btnUpdate: css`
    padding: 8px 20px;
    border-radius: 6px;
    border: none;
    background: #1d4ed8;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    &:hover { background: #2563eb; }
  `,
  btnCancel: css`
    padding: 8px 20px;
    border-radius: 6px;
    border: 1px solid #1e2d3d;
    background: transparent;
    color: #567090;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
      background: #1a2535;
      color: #a0bdcf;
    }
  `,
});

export const AckModal = ({ problem: _problem, onClose, onSubmit }: AckModalProps) => {
  const styles = useStyles2(getStyles);
  const [message, setMessage] = useState('');
  const [acknowledge, setAcknowledge] = useState(true);
  const [changeSeverity, setChangeSeverity] = useState(false);
  const [closeProblem, setCloseProblem] = useState(false);

  const handleSubmit = () => {
    onSubmit({ message, acknowledge, changeSeverity, closeProblem });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >

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
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter' && e.ctrlKey) { handleSubmit(); }
              if (e.key === 'Escape') { onClose(); }
            }}
            onKeyUp={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
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
