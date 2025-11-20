// components/campaign/ContactSelector.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Chip,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import type { Cap, Contact } from "../../types/campaign";
import { tuscanyCaps, contacts } from "../../utils/constants";
import axios from "axios";

interface Customer {
  CustomerId?: number;
  CompanyId?: number;
  CustomerFullName?: string;
  CompanyName?: string;
  CustomerEmail?: string;
  CompanyEmail?: string;
  CustomerPhone?: string;
  CompanyPhone?: string;
  PolicyAccepted?: boolean;
  Agente: string;
  Cap: string;
  id?: number; // ID generico per entrambi i tipi
  name?: string; // Nome generico per entrambi i tipi
  email?: string; // Email generico per entrambi i tipi
  phone?: string; // Telefono generico per entrambi i tipi
  isBlocked: boolean;
}

interface ContactSelectorProps {
  onCapsSelect: (caps: Cap[]) => void;
  onContactsSelect: (contacts: Contact[]) => void;
  selectedCaps: Cap[];
  selectedContacts: Contact[];
  customerType: string; // "private", "business" o "premium"
}

export function ContactSelector({
  onCapsSelect,
  onContactsSelect,
  selectedCaps,
  selectedContacts,
  customerType = "private", // Default a "private" se non specificato
}: ContactSelectorProps) {
  // IMPORTANTE: Log per debugging all'inizio del componente
  console.log("=============================================");
  console.log(`MONTAGGIO ContactSelector per tipo cliente: ${customerType}`);
  console.log("=============================================");

  // Verifica che sia stato passato un valore valido per customerType
  if (!["private", "business", "premium"].includes(customerType)) {
    console.error(`ContactSelector - Tipo cliente non valido: ${customerType}`);
    // Se il valore non è valido, usa il default "private"
    customerType = "private";
  }

  // Log visibile per debugging
  console.log("ContactSelector - Rendering con tipo cliente:", customerType);

  const [capSearchTerm, setCapSearchTerm] = useState("");
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [showCapDropdown, setShowCapDropdown] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [focusedCapIndex, setFocusedCapIndex] = useState(-1);
  const [focusedContactIndex, setFocusedContactIndex] = useState(-1);
  const capInputRef = useRef<HTMLInputElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const capDropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);

  // Stati per la gestione dei contatti e il filtraggio
  const [allContacts, setAllContacts] = useState<Customer[]>([]);
  const [filteredRecipients, setFilteredRecipients] = useState<Customer[]>([]);
  const [showRecipients, setShowRecipients] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Aggiungiamo uno stato per tenere traccia dell'ultimo tipo di cliente caricato
  const [lastLoadedCustomerType, setLastLoadedCustomerType] =
    useState<string>("");

  const filteredCaps = tuscanyCaps.filter(
    (cap) =>
      !selectedCaps.some((selectedCap) => selectedCap.Cap === cap.Cap) &&
      (capSearchTerm === "" ||
        cap.Cap.toLowerCase().includes(capSearchTerm.toLowerCase()) ||
        cap.City.toLowerCase().includes(capSearchTerm.toLowerCase()))
  );

  const filteredContacts = contacts.filter(
    (contact) =>
      !selectedContacts.some(
        (selectedContact) => selectedContact.code === contact.code
      ) &&
      (contactSearchTerm === "" ||
        contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
        contact.code.toLowerCase().includes(contactSearchTerm.toLowerCase()))
  );

  const handleCapSelect = (cap: Cap) => {
    onCapsSelect([...selectedCaps, cap]);
    setCapSearchTerm("");
    setFocusedCapIndex(-1);
    capInputRef.current?.focus();
  };

  const handleContactSelect = (contact: Contact) => {
    onContactsSelect([...selectedContacts, contact]);
    setContactSearchTerm("");
    setFocusedContactIndex(-1);
    contactInputRef.current?.focus();
  };

  const handleRemoveCap = (capToRemove: Cap) => {
    onCapsSelect(selectedCaps.filter((cap) => cap.Cap !== capToRemove.Cap));
  };

  const handleRemoveContact = (contactToRemove: Contact) => {
    onContactsSelect(
      selectedContacts.filter(
        (contact) => contact.code !== contactToRemove.code
      )
    );
  };

  const handleCapKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedCapIndex((prev) =>
        prev < filteredCaps.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedCapIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && focusedCapIndex >= 0) {
      e.preventDefault();
      handleCapSelect(filteredCaps[focusedCapIndex]);
    }
  };

  const handleContactKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedContactIndex((prev) =>
        prev < filteredContacts.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedContactIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && focusedContactIndex >= 0) {
      e.preventDefault();
      handleContactSelect(filteredContacts[focusedContactIndex]);
    }
  };

  // Carica i contatti quando cambia il tipo di cliente
  useEffect(() => {
    // Verifica se il tipo di cliente è effettivamente cambiato
    if (customerType !== lastLoadedCustomerType) {
      console.log(
        `ContactSelector - Tipo cliente cambiato da "${lastLoadedCustomerType}" a "${customerType}"`
      );

      // Aggiorna lo stato che tiene traccia dell'ultimo tipo di cliente caricato
      setLastLoadedCustomerType(customerType);

      // Resettare i filtri e lo stato interno
      setFilteredRecipients([]);
      setShowRecipients(false);

      // Ricarica i contatti con il nuovo tipo di cliente
      setIsLoading(true);
      fetchContacts()
        .then(() => {
          console.log(
            `ContactSelector - Contatti caricati con successo per tipo: ${customerType}`
          );
        })
        .catch((error) => {
          console.error(
            `ContactSelector - Errore nel caricamento contatti per ${customerType}:`,
            error
          );
          setErrorMessage(
            `Errore nel caricamento dei contatti ${getCustomerTypeText()}. Riprova più tardi.`
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [customerType]);

  // Funzione per caricare i contatti dall'API in base al tipo di cliente
  const fetchContacts = async () => {
    console.log(
      `ContactSelector - fetchContacts iniziato per tipo: ${customerType}`
    );
    try {
      setIsLoading(true);
      setErrorMessage(null);

      let response;

      // Determina se è premium in base al tipo di cliente
      const isPremium = customerType === "premium";

      // Carica i contatti in base al tipo di cliente selezionato
      if (customerType === "business") {
        // Per i clienti aziendali
        console.log(
          `ContactSelector - Caricamento contatti aziendali${
            isPremium ? " premium" : ""
          }...`
        );
        response = await axios.get("/Contacts/GET/GetAllCompany", {
          params: { isPremium }, // Aggiungo isPremium per le aziende
        });
      } else {
        // Per i clienti privati o premium
        console.log(
          `ContactSelector - Caricamento contatti ${
            isPremium ? "premium" : "privati"
          }...`
        );
        response = await axios.get("/Contacts/GET/GetAllPrivate", {
          params: { isPremium },
        });
      }

      // Verifica se la risposta è valida
      if (response.data && Array.isArray(response.data)) {
        // Normalizza i dati per avere una struttura uniforme indipendentemente dal tipo
        const contacts = response.data.map((contact: any) => {
          // Determina i campi in base al tipo di cliente
          const isCompany = customerType === "business";

          const normalizedContact: Customer = {
            Agente: contact.Agente || "",
            Cap: contact.Cap || "",
            // Campi generici per facilitare il rendering
            id: isCompany ? contact.CompanyId : contact.CustomerId || 0,
            name: isCompany
              ? contact.CompanyName
              : contact.CustomerFullName || "",
            email: isCompany
              ? contact.CompanyEmail
              : contact.CustomerEmail || "",
            phone: isCompany
              ? contact.CompanyPhone
              : contact.CustomerPhone || "",
            // Preserva i campi originali
            ...contact,
          };

          return normalizedContact;
        });

        console.log(
          `ContactSelector - Contatti ${customerType} caricati (${contacts.length})`
        );
        if (contacts.length > 0) {
          console.log("ContactSelector - Esempio primo contatto:", contacts[0]);
        }

        setAllContacts(contacts);

        // Se ci sono filtri attivi, applica il filtraggio
        if (selectedCaps.length > 0 || selectedContacts.length > 0) {
          const filtered = filterContacts(contacts);
          setFilteredRecipients(filtered);
        }

        return contacts;
      } else {
        console.warn("ContactSelector - API ha restituito dati non validi");
        setErrorMessage("Impossibile caricare i contatti: risposta non valida");
        setAllContacts([]);

        return [];
      }
    } catch (error) {
      console.error(
        `ContactSelector - Errore nel caricamento dei contatti ${customerType}:`,
        error
      );
      setErrorMessage(
        "Errore nel caricamento dei contatti. Riprova più tardi."
      );
      setAllContacts([]);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  console.log(errorMessage);
  // Funzione per filtrare i contatti in base ai criteri selezionati
  const filterContacts = (contacts = allContacts) => {
    // Se non ci sono contatti, non fare nulla
    if (contacts.length === 0) {
      console.log("Nessun contatto da filtrare");
      return [];
    }

    // Se non ci sono filtri, mostra tutti i contatti
    if (selectedCaps.length === 0 && selectedContacts.length === 0) {
      console.log("Nessun filtro selezionato");
      return [];
    }

    console.log(`Filtraggio contatti ${customerType} con:`, {
      caps: selectedCaps.map((cap) => cap.Cap),
      agents: selectedContacts.map((agent) => agent.code),
    });

    return contacts.filter((contact) => {
      // Verifica se il contatto ha i campi necessari
      if (!contact) {
        console.warn("Contatto non valido:", contact);
        return false;
      }

      // Verifica se il CAP del contatto corrisponde a uno dei CAP selezionati
      const matchesCap =
        selectedCaps.length === 0 ||
        selectedCaps.some((selectedCap) => {
          const contactCap = contact.Cap || "";
          return contactCap === selectedCap.Cap;
        });

      // Verifica se l'agente del contatto corrisponde a uno degli agenti selezionati
      const matchesAgent =
        selectedContacts.length === 0 ||
        selectedContacts.some((selectedAgent) => {
          if (!contact.Agente) return false;

          // Confronta il codice dell'agente con il valore in Agente
          return contact.Agente === selectedAgent.code;
        });

      // Verifica se il contatto è bloccato
      const isBlocked = contact.isBlocked;
      if (isBlocked) {
        console.log("Contatto bloccato:", contact.name);
        return false;
      }

      return matchesCap && matchesAgent && !isBlocked;
    });
  };

  // Aggiorna i filtri quando cambiano le selezioni di CAP o agenti
  useEffect(() => {
    if (allContacts.length > 0) {
      console.log(
        `Aggiornamento filtri con ${allContacts.length} contatti ${customerType}`
      );
      const filtered = filterContacts();
      console.log(
        `Contatti filtrati: ${filtered.length} su ${allContacts.length}`
      );
      setFilteredRecipients(filtered);
    } else {
      console.log("Nessun contatto caricato per applicare filtri");
    }
  }, [selectedCaps, selectedContacts, allContacts.length]);

  // Gestione del click fuori dalle dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        capDropdownRef.current &&
        !capDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCapDropdown(false);
      }
      if (
        contactDropdownRef.current &&
        !contactDropdownRef.current.contains(event.target as Node)
      ) {
        setShowContactDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ottieni il testo del tipo di cliente per la UI
  const getCustomerTypeText = () => {
    console.log("getCustomerTypeText chiamato con customerType:", customerType);
    switch (customerType) {
      case "business":
        return "aziendali";
      case "premium":
        return "premium";
      default:
        return "privati";
    }
  };

  // Informazioni sul tipo cliente direttamente calcolate per evitare problemi di stato
  const customerTypeText = (() => {
    switch (customerType) {
      case "business":
        return "aziendali";
      case "premium":
        return "premium";
      default:
        return "privati";
    }
  })();

  const customerTypeEmoji = (() => {
    switch (customerType) {
      case "business":
        return "🏢";
      case "premium":
        return "🥇";
      default:
        return "🧑‍💻";
    }
  })();

  console.log("ContactSelector render - customerType:", customerType);
  console.log("ContactSelector render - customerTypeText:", customerTypeText);
  console.log("ContactSelector render - customerTypeEmoji:", customerTypeEmoji);

  return (
    <>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base/7 font-semibold text-gray-900">
          Seleziona destinatari campagna
        </h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          <span className="inline-flex items-center gap-1 font-medium">
            {customerTypeEmoji}
            Stai selezionando clienti <strong>{customerTypeText}</strong>
          </span>
          <br />
          Seleziona le zone e gli agenti per filtrare i destinatari.
          <br />
          <span className="text-primary font-medium">
            Puoi selezionare più elementi contemporaneamente ✨
          </span>
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* CAP Selector */}
          <div className="sm:col-span-3">
            <div className="space-y-2">
              <label
                htmlFor="cap-input"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Zone (CAP)
              </label>
              <div className="flex items-center gap-2">
                <Chip size="sm" variant="flat" color="primary">
                  Selezione multipla
                </Chip>
              </div>
              <div className="relative" ref={capDropdownRef}>
                <Input
                  ref={capInputRef}
                  id="cap-input"
                  placeholder="Cerca e seleziona CAP o città..."
                  value={capSearchTerm}
                  onChange={(e) => setCapSearchTerm(e.target.value)}
                  onFocus={() => setShowCapDropdown(true)}
                  onKeyDown={handleCapKeyDown}
                  aria-label="Cerca CAP o città"
                  aria-autocomplete="list"
                  aria-controls="cap-dropdown"
                  aria-expanded={showCapDropdown}
                  variant="bordered"
                  radius="sm"
                  isDisabled={isLoading}
                />
                {showCapDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-[280px] overflow-auto">
                    <div id="cap-dropdown" role="listbox" className="p-1">
                      {filteredCaps.map((cap, index) => (
                        <button
                          key={cap.Cap}
                          onClick={() => handleCapSelect(cap)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                            index === focusedCapIndex ? "bg-gray-100" : ""
                          }`}
                          role="option"
                          aria-selected={index === focusedCapIndex}
                        >
                          <span>{cap.City}</span>
                          <span className="text-gray-400 float-right">
                            {cap.Cap}
                          </span>
                        </button>
                      ))}
                      {filteredCaps.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                          Nessun risultato trovato
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {selectedCaps.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedCaps.map((cap) => (
                    <Chip
                      key={cap.Cap}
                      onClose={() => handleRemoveCap(cap)}
                      variant="flat"
                      size="sm"
                      className="bg-primary/10"
                    >
                      {cap.City} ({cap.Cap})
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Contact Selector */}
          <div className="sm:col-span-3">
            <div className="space-y-2">
              <label
                htmlFor="contact-input"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Agenti
              </label>
              <div className="flex items-center gap-2">
                <Chip size="sm" variant="flat" color="primary">
                  Selezione multipla
                </Chip>
              </div>
              <div className="relative" ref={contactDropdownRef}>
                <Input
                  ref={contactInputRef}
                  id="contact-input"
                  placeholder="Cerca e seleziona agenti..."
                  value={contactSearchTerm}
                  onChange={(e) => setContactSearchTerm(e.target.value)}
                  onFocus={() => setShowContactDropdown(true)}
                  onKeyDown={handleContactKeyDown}
                  aria-label="Cerca agenti"
                  aria-autocomplete="list"
                  aria-controls="contact-dropdown"
                  aria-expanded={showContactDropdown}
                  variant="bordered"
                  radius="sm"
                  isDisabled={isLoading}
                />
                {showContactDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-[280px] overflow-auto">
                    <div id="contact-dropdown" role="listbox" className="p-1">
                      {filteredContacts.map((contact, index) => (
                        <button
                          key={contact.code}
                          onClick={() => handleContactSelect(contact)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                            index === focusedContactIndex ? "bg-gray-100" : ""
                          }`}
                          role="option"
                          aria-selected={index === focusedContactIndex}
                        >
                          <span>{contact.name}</span>
                          <span className="text-gray-400 float-right">
                            #{contact.code}
                          </span>
                        </button>
                      ))}
                      {filteredContacts.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                          Nessun risultato trovato
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {selectedContacts.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedContacts.map((contact) => (
                    <Chip
                      key={contact.code}
                      onClose={() => handleRemoveContact(contact)}
                      variant="flat"
                      size="sm"
                      className="bg-primary/10"
                    >
                      {contact.name} #{contact.code}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sezione destinatari */}
        {(selectedCaps.length > 0 || selectedContacts.length > 0) && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Destinatari della campagna
              </h3>
              <Button
                color="primary"
                variant="bordered"
                onClick={() => setShowRecipients(!showRecipients)}
                endContent={showRecipients ? "▼" : "▶"}
                className="flex items-center gap-1"
              >
                <span className="font-medium">{filteredRecipients.length}</span>
                <span>
                  {showRecipients
                    ? "Nascondi destinatari"
                    : "Visualizza destinatari"}
                </span>
              </Button>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Riepilogo campagna:
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Totale destinatari: {filteredRecipients.length}</li>
                <li>• Tipo cliente: {getCustomerTypeText()}</li>
                {selectedCaps.length > 0 && (
                  <li>
                    • Zone selezionate:{" "}
                    {selectedCaps
                      .map((cap) => `${cap.City} (${cap.Cap})`)
                      .join(", ")}
                  </li>
                )}
                {selectedContacts.length > 0 && (
                  <li>
                    • Agenti selezionati:{" "}
                    {selectedContacts.map((agent) => agent.name).join(", ")}
                  </li>
                )}
              </ul>
            </div>

            {showRecipients && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center p-10">
                    <Spinner size="lg" />
                    <p className="mt-2 text-sm text-gray-500">
                      Caricamento destinatari in corso...
                    </p>
                  </div>
                ) : filteredRecipients.length > 0 ? (
                  <Table
                    aria-label="Tabella destinatari"
                    isHeaderSticky
                    classNames={{
                      wrapper: "max-h-[400px]",
                    }}
                  >
                    <TableHeader>
                      <TableColumn>Nome</TableColumn>
                      <TableColumn>Email</TableColumn>
                      <TableColumn>Telefono</TableColumn>
                      <TableColumn>Agente</TableColumn>
                      <TableColumn>CAP</TableColumn>
                    </TableHeader>
                    <TableBody
                      items={filteredRecipients.slice(0, 100)} // Limita a 100 per performance
                    >
                      {(recipient) => (
                        <TableRow key={recipient.id}>
                          <TableCell>{recipient.name}</TableCell>
                          <TableCell>{recipient.email || "-"}</TableCell>
                          <TableCell>{recipient.phone || "-"}</TableCell>
                          <TableCell>
                            {/* Mostra il nome dell'agente invece del codice */}
                            {contacts.find((c) => c.code === recipient.Agente)
                              ?.name || recipient.Agente}
                          </TableCell>
                          <TableCell>{recipient.Cap}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center p-10">
                    <p className="text-sm text-gray-500">
                      Nessun destinatario corrisponde ai filtri selezionati
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
