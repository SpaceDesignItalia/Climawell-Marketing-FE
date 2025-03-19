"use client"

import React, { useState, useEffect } from "react";
import { Button, RadioGroup } from "@heroui/react";
import { ContactSelector } from "../../Components/Campaigns/Other/components/campaign/ContactSelector";
import { CustomRadio } from "../../Components/Campaigns/Other/components/campaign/CustomRadio";
import type { Cap, Contact } from "../../Components/Campaigns/Other/types/campaign";

/**
 * Pagina per la creazione di una nuova campagna marketing.
 * Integra i radio button per la selezione del tipo cliente con il ContactSelector.
 */
export default function NewCampaignPage() {
  // Stato per il tipo di cliente selezionato
  const [customerType, setCustomerType] = useState<string>("private");
  
  // Stati per i filtri di ContactSelector - uno per ogni tipo di cliente
  const [privateCaps, setPrivateCaps] = useState<Cap[]>([]);
  const [privateContacts, setPrivateContacts] = useState<Contact[]>([]);
  
  const [businessCaps, setBusinessCaps] = useState<Cap[]>([]);
  const [businessContacts, setBusinessContacts] = useState<Contact[]>([]);
  
  const [premiumCaps, setPremiumCaps] = useState<Cap[]>([]);
  const [premiumContacts, setPremiumContacts] = useState<Contact[]>([]);
  
  // Handler per il cambio del tipo di cliente
  const handleCustomerTypeChange = (value: string) => {
    console.log("NewCampaignPage - Cambio tipo cliente da", customerType, "a", value);
    setCustomerType(value);
  };

  // Per debugging
  useEffect(() => {
    console.log("NewCampaignPage - customerType aggiornato:", customerType);
  }, [customerType]);

  // Seleziona i setter corretti in base al tipo cliente
  const getCurrentProps = () => {
    switch(customerType) {
      case "business":
        return {
          caps: businessCaps,
          contacts: businessContacts,
          setCaps: setBusinessCaps,
          setContacts: setBusinessContacts
        };
      case "premium":
        return {
          caps: premiumCaps,
          contacts: premiumContacts,
          setCaps: setPremiumCaps,
          setContacts: setPremiumContacts
        };
      default: // "private"
        return {
          caps: privateCaps,
          contacts: privateContacts,
          setCaps: setPrivateCaps,
          setContacts: setPrivateContacts
        };
    }
  };

  // Ottieni le props per il selettore corrente
  const { caps, contacts } = getCurrentProps();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Crea nuova campagna</h1>
        <p className="text-gray-600">Configura i dettagli della tua campagna marketing</p>
      </div>
      
      {/* Sezione selezione tipo cliente */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="border-b border-gray-900/10 pb-8">
          <div className="flex flex-col gap-5 sm:col-span-4">
            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">
                Seleziona il tipo di cliente
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Scegli il tipo di cliente per cui stai iniziando la campagna.
                <br />
                Questa selezione ci aiuterà a personalizzare le informazioni richieste.
              </p>
            </div>

            <RadioGroup
              orientation="horizontal"
              description="Seleziona il tipo di cliente"
              value={customerType}
              onValueChange={handleCustomerTypeChange}
            >
              <CustomRadio
                description="Seleziona questa opzione per inviare la campagna ai clienti privati."
                value="private"
              >
                <span className="flex items-center gap-2">
                  🧑‍💻 Cliente Privato
                </span>
              </CustomRadio>
              <CustomRadio
                description="Seleziona questa opzione per inviare la campagna alle aziende."
                value="business"
              >
                <span className="flex items-center gap-2">
                  🏢 Cliente Azienda
                </span>
              </CustomRadio>
              <CustomRadio
                description="Seleziona questa opzione per inviare la campagna ai clienti premium."
                value="premium"
              >
                <span className="flex items-center gap-2">
                  🥇 Cliente Premium
                </span>
              </CustomRadio>
            </RadioGroup>
          </div>
        </div>
        
        {/* SOLUZIONE ALTERNATIVA: Uso di switch/case per renderizzare il componente corretto */}
        <div className="mt-8" key={`selector-container-${customerType}`}>
          {(() => {
            console.log("Rendering selector per tipo cliente:", customerType);
            
            switch(customerType) {
              case "business":
                return (
                  <ContactSelector
                    key="business-selector"
                    customerType="business"
                    selectedCaps={businessCaps}
                    selectedContacts={businessContacts}
                    onCapsSelect={setBusinessCaps}
                    onContactsSelect={setBusinessContacts}
                  />
                );
              case "premium":
                return (
                  <ContactSelector
                    key="premium-selector"
                    customerType="premium"
                    selectedCaps={premiumCaps}
                    selectedContacts={premiumContacts}
                    onCapsSelect={setPremiumCaps}
                    onContactsSelect={setPremiumContacts}
                  />
                );
              default: // "private"
                return (
                  <ContactSelector
                    key="private-selector"
                    customerType="private"
                    selectedCaps={privateCaps}
                    selectedContacts={privateContacts}
                    onCapsSelect={setPrivateCaps}
                    onContactsSelect={setPrivateContacts}
                  />
                );
            }
          })()}
        </div>
      </div>
      
      {/* Debug info - solo per sviluppo */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg text-xs">
        <p className="font-bold mb-1">Informazioni di debug:</p>
        <p>Tipo cliente attuale: <strong>{customerType}</strong></p>
        <p>
          Contatti {customerType === "private" ? "privati" : 
                   customerType === "business" ? "aziendali" : 
                   "premium"} selezionati: <strong>{contacts.length}</strong>
        </p>
        <p>CAP selezionati: <strong>{caps.length}</strong></p>
      </div>
      
      {/* Pulsanti di navigazione */}
      <div className="flex justify-end gap-4 mt-8">
        <Button variant="flat" color="danger">
          Annulla
        </Button>
        <Button color="primary">
          Continua
        </Button>
      </div>
    </div>
  );
} 