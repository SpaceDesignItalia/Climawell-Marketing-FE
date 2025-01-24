// components/campaign/ContactSelector.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Input, Chip } from "@heroui/react"
import type { Cap, Contact } from "../../types/campaign"
import { tuscanyCaps, contacts } from "../../utils/constants"

interface ContactSelectorProps {
  onCapsSelect: (caps: Cap[]) => void
  onContactsSelect: (contacts: Contact[]) => void
  selectedCaps: Cap[]
  selectedContacts: Contact[]
}

export function ContactSelector({
  onCapsSelect,
  onContactsSelect,
  selectedCaps,
  selectedContacts,
}: ContactSelectorProps) {
  const [capSearchTerm, setCapSearchTerm] = useState("")
  const [contactSearchTerm, setContactSearchTerm] = useState("")
  const [showCapDropdown, setShowCapDropdown] = useState(false)
  const [showContactDropdown, setShowContactDropdown] = useState(false)
  const [focusedCapIndex, setFocusedCapIndex] = useState(-1)
  const [focusedContactIndex, setFocusedContactIndex] = useState(-1)
  const capInputRef = useRef<HTMLInputElement>(null)
  const contactInputRef = useRef<HTMLInputElement>(null)
  const capDropdownRef = useRef<HTMLDivElement>(null)
  const contactDropdownRef = useRef<HTMLDivElement>(null)

  const filteredCaps = tuscanyCaps.filter(
    (cap) =>
      !selectedCaps.some((selectedCap) => selectedCap.Cap === cap.Cap) &&
      (capSearchTerm === "" ||
        cap.Cap.toLowerCase().includes(capSearchTerm.toLowerCase()) ||
        cap.City.toLowerCase().includes(capSearchTerm.toLowerCase()))
  )

  const filteredContacts = contacts.filter(
    (contact) =>
      !selectedContacts.some((selectedContact) => selectedContact.code === contact.code) &&
      (contactSearchTerm === "" ||
        contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
        contact.code.toLowerCase().includes(contactSearchTerm.toLowerCase()))
  )

  const handleCapSelect = (cap: Cap) => {
    onCapsSelect([...selectedCaps, cap])
    setCapSearchTerm("")
    setFocusedCapIndex(-1)
    capInputRef.current?.focus()
  }

  const handleContactSelect = (contact: Contact) => {
    onContactsSelect([...selectedContacts, contact])
    setContactSearchTerm("")
    setFocusedContactIndex(-1)
    contactInputRef.current?.focus()
  }

  const handleRemoveCap = (capToRemove: Cap) => {
    onCapsSelect(selectedCaps.filter((cap) => cap.Cap !== capToRemove.Cap))
  }

  const handleRemoveContact = (contactToRemove: Contact) => {
    onContactsSelect(selectedContacts.filter((contact) => contact.code !== contactToRemove.code))
  }

  const handleCapKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedCapIndex((prev) => (prev < filteredCaps.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedCapIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && focusedCapIndex >= 0) {
      e.preventDefault()
      handleCapSelect(filteredCaps[focusedCapIndex])
    }
  }

  const handleContactKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedContactIndex((prev) => (prev < filteredContacts.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedContactIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && focusedContactIndex >= 0) {
      e.preventDefault()
      handleContactSelect(filteredContacts[focusedContactIndex])
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (capDropdownRef.current && !capDropdownRef.current.contains(event.target as Node)) {
        setShowCapDropdown(false)
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
        setShowContactDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base/7 font-semibold text-gray-900">Seleziona destinatari campagna</h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          Seleziona le zone e gli agenti per la tua campagna.
          <br />
          <span className="text-primary font-medium">Puoi selezionare più elementi contemporaneamente ✨</span>
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
                <Chip size="sm" variant="flat" color="primary">Selezione multipla</Chip>
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
                          <span className="text-gray-400 float-right">{cap.Cap}</span>
                        </button>
                      ))}
                      {filteredCaps.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">Nessun risultato trovato</div>
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
                <Chip size="sm" variant="flat" color="primary">Selezione multipla</Chip>
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
                          <span className="text-gray-400 float-right">#{contact.code}</span>
                        </button>
                      ))}
                      {filteredContacts.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">Nessun risultato trovato</div>
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
      </div>
    </>
  )
}