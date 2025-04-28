import React from "react";
import { CHANNELS } from "./ChannelSelector.jsx";
import Badges from "./Badges";
import MuralRecados from "./MuralRecados";
import JogosAgendaModal from "./JogosAgendaModal";
import PlacaresModal from "./PlacaresModal";

export default function MobileSidebarMenu({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="furia-mobile-menu-overlay" onClick={onClose}>
      <aside className="furia-mobile-sidebar" onClick={e => e.stopPropagation()}>
        <button className="furia-mobile-menu-close" onClick={onClose} aria-label="Fechar menu">×</button>
      </aside>
    </div>
  );
}
