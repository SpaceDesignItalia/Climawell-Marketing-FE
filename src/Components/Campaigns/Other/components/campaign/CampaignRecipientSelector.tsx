"use client";

import { useEffect, useState } from "react";
import type { Cap, Contact } from "../../types/campaign";
import { ContactSelector } from "./ContactSelector";
import { CustomerTypeSelector } from "./CustomerTypeSelector";

/**
 * Componente principale che integra la selezione del tipo cliente e la selezione dei destinatari.
 * Gestisce lo stato condiviso tra i due componenti e assicura che i dati corretti vengano caricati.
 */
export function CampaignRecipientSelector() {
  console.log("CampaignRecipientSelector rendering");

  // Stato comune per il tipo di cliente
  const [customerType, setCustomerType] = useState<string>("private");

  // Stati per i filtri
  const [selectedCaps, setSelectedCaps] = useState<Cap[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  // Effetto per loggare quando il tipo di cliente cambia
  useEffect(() => {
    console.log(
      "CampaignRecipientSelector - Tipo cliente aggiornato:",
      customerType
    );
  }, [customerType]);

  // Effetto per loggare quando i filtri cambiano
  useEffect(() => {
    console.log("CampaignRecipientSelector - Filtri aggiornati:", {
      caps: selectedCaps.length,
      contacts: selectedContacts.length,
    });
  }, [selectedCaps, selectedContacts]);

  // Handler per il cambio tipo cliente che resetta anche i filtri
  const handleCustomerTypeChange = (value: string) => {
    console.log(
      "CampaignRecipientSelector - Cambio tipo cliente da",
      customerType,
      "a",
      value
    );

    // Prima resettiamo i filtri
    setSelectedCaps([]);
    setSelectedContacts([]);

    // Poi cambiamo il tipo di cliente
    setCustomerType(value);
  };

  // Handler per aggiornare i cap selezionati
  const handleCapsSelect = (caps: Cap[]) => {
    console.log(
      "CampaignRecipientSelector - Aggiornamento CAP selezionati:",
      caps.length
    );
    setSelectedCaps(caps);
  };

  // Handler per aggiornare gli agenti selezionati
  const handleContactsSelect = (contacts: Contact[]) => {
    console.log(
      "CampaignRecipientSelector - Aggiornamento agenti selezionati:",
      contacts.length
    );
    setSelectedContacts(contacts);
  };

  return (
    <div className="space-y-8">
      {/* Sezione selezione tipo cliente */}
      <div className="border-b border-gray-900/10 pb-8">
        <CustomerTypeSelector
          value={customerType}
          onChange={handleCustomerTypeChange}
        />
      </div>

      {/* Sezione selezione contatti */}
      <ContactSelector
        customerType={customerType}
        selectedCaps={selectedCaps}
        selectedContacts={selectedContacts}
        onCapsSelect={handleCapsSelect}
        onContactsSelect={handleContactsSelect}
      />
    </div>
  );
}
