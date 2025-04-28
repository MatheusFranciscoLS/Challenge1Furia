/**
 * FuriaModal.jsx
 * Modal reutilizável para confirmação de ações na aplicação FURIA.
 *
 * Props:
 * - open (boolean): controla a exibição do modal.
 * - onClose (function): callback para fechar/cancelar o modal.
 * - onConfirm (function): callback para ação de confirmação (ex: sair).
 * - message (string): mensagem exibida no corpo do modal.
 *
 * O modal é acessível (aria-modal, role=dialog) e só é renderizado quando open=true.
 * Para expandir: adicione ícones, títulos customizáveis, ou diferentes tipos de ação.
 */
import React from "react";

export default function FuriaModal({ open, onClose, onConfirm, message }) {
  // Só renderiza o modal se open=true
  if (!open) return null;
  return (
    <div
      className="furia-modal-overlay"
      tabIndex={0}
      aria-modal="true"
      role="dialog"
    >
      <div className="furia-modal-center">
        <div className="furia-modal-card">
          {/* Mensagem principal do modal */}
          <p style={{ fontWeight: 600, fontSize: '1.18em', marginBottom: 18 }}>{message}</p>
          <div className="furia-modal-btns">
            {/* Botão de confirmação */}
            <button className="furia-btn" onClick={onConfirm} style={{ marginRight: 12 }}>Sim, sair</button>
            {/* Botão de cancelar/fechar */}
            <button className="furia-btn" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
