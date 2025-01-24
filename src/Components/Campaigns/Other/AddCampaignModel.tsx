// AddContactModel.tsx
"use client"

import { useEffect, useState } from "react"
import { useDisclosure } from "@heroui/react"
import { Button } from "@heroui/react"
import axios from "axios"
import type { EmailCampaign, WhatsappCampaign, Contact, Cap } from "./types/campaign"
import { EMAILCAMPAIGN_INITIAL, WHATSAPPCAMPAIGN_INITIAL } from "./utils/constants"
import { CustomerTypeSelector } from "./components/campaign/CustomerTypeSelector"
import { CampaignTypeSelector } from "./components/campaign/CampaignTypeSelector"
import { ContactSelector } from "./components/campaign/ContactSelector"
import { CampaignForm } from "./components/campaign/CampaignForm"
import { ConfirmationModal } from "./components/campaign/ConfirmationModal"
import { PreviewMailModal, PreviewWhatsAppModal } from "./preview-components"

export default function AddContactModel() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [customerType, setCustomerType] = useState("private")
  const [campaignType, setCampaignType] = useState("email")
  const [emailCampaign, setEmailCampaign] = useState<EmailCampaign>(EMAILCAMPAIGN_INITIAL)
  const [whatsappCampaign, setWhatsappCampaign] = useState<WhatsappCampaign>(WHATSAPPCAMPAIGN_INITIAL)
  const [images, setImages] = useState<FileList | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [whatsAppPreviewOpen, setWhatsAppPreviewOpen] = useState(false)
  const [selectedCaps, setSelectedCaps] = useState<Cap[]>([])
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isWhatsappBlock, setIsWhatsappBlock] = useState({ blocked: false })

  const handleEmailCampaignInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailCampaign((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleWhatsappCampaignInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setWhatsappCampaign((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleBothInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailCampaign((prevData) => ({ ...prevData, [name]: value }))
    setWhatsappCampaign((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImages(e.target.files)
    }
  }

  function handleRadioValueChange(e: string) {
    setEmailCampaign(EMAILCAMPAIGN_INITIAL)
    setWhatsappCampaign(WHATSAPPCAMPAIGN_INITIAL)
    setImages(null)
    setCampaignType(e)
  }

  async function handleSubmit() {
    try {
      setIsLoading(true)
      const CustomerData = new FormData()

      // Add campaign type and customer type
      CustomerData.append("CampaignType", campaignType)
      CustomerData.append("ContactType", customerType)

      // Add campaign data based on type
      if (campaignType === "email" || campaignType === "both") {
        if (
          emailCampaign.Title === "" ||
          emailCampaign.Object === "" ||
          emailCampaign.Description === "" ||
          images === null
        ) {
          alert("Compila tutti i campi")
          return
        }
        CustomerData.append("EmailCampaignData", JSON.stringify(emailCampaign))
      }

      if (campaignType === "whatsapp" || campaignType === "both") {
        if (whatsappCampaign.Title === "" || whatsappCampaign.Description === "" || images === null) {
          alert("Compila tutti i campi")
          return
        }
        CustomerData.append("WhatsappCampaignData", JSON.stringify(whatsappCampaign))
      }

      // Add images
      if (images) {
        Array.from(images).forEach((image) => {
          CustomerData.append("Images", image)
        })
      }

      // Add selected CAPs
      CustomerData.append("SelectedCaps", JSON.stringify(selectedCaps))

      // Add selected contacts
      CustomerData.append("SelectedContacts", JSON.stringify(selectedContacts))

      const res = await axios.post("/Campaigns/POST/AddNewCampaign", CustomerData)
      if (res.status === 201) {
        window.location.href = "/Campaigns"
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Si è verificato un errore:", error)
    }
  }

  useEffect(() => {
    async function checkWhatsappBlock() {
      const res = await axios.get("/Campaigns/GET/CheckWhatsappBlock")
      if (res.status === 200) {
        setIsWhatsappBlock(res.data)
      }
    }
    checkWhatsappBlock()
  }, [])

  return (
    <form className="relative">
      {(campaignType === "email" || campaignType === "both" || campaignType === "whatsapp") && (
        <div className="w-full flex flex-row justify-end gap-2">
          {(campaignType === "email" || campaignType === "both") && (
            <Button type="button" color="primary" size="lg" onClick={() => setPreviewOpen(true)}>
              👀 Anteprima Email
            </Button>
          )}
          {(campaignType === "whatsapp" || campaignType === "both") && (
            <Button
              type="button"
              color="success"
              size="lg"
              className="text-white"
              onClick={() => setWhatsAppPreviewOpen(true)}
            >
              👀 Anteprima WhatsApp
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-5 space-y-12">
        <div className="flex flex-row gap-5 sm:col-span-4">
          <CustomerTypeSelector value={customerType} onChange={setCustomerType} />
          <CampaignTypeSelector
            value={campaignType}
            onChange={handleRadioValueChange}
            isWhatsappBlocked={isWhatsappBlock.blocked}
          />
        </div>

        <ContactSelector
          onCapsSelect={setSelectedCaps}
          onContactsSelect={setSelectedContacts}
          selectedCaps={selectedCaps}
          selectedContacts={selectedContacts}
        />

        {campaignType === "email" && (
          <CampaignForm
            type="email"
            onTitleChange={handleEmailCampaignInput}
            onObjectChange={handleEmailCampaignInput}
            onDescriptionChange={(value) =>
              setEmailCampaign((prevData) => ({
                ...prevData,
                Description: value,
              }))
            }
            onImageChange={handleImageInput}
          />
        )}

        {campaignType === "whatsapp" && (
          <CampaignForm
            type="whatsapp"
            onTitleChange={handleWhatsappCampaignInput}
            onDescriptionChange={(value) =>
              setWhatsappCampaign((prevData) => ({
                ...prevData,
                Description: value,
              }))
            }
            onImageChange={handleImageInput}
            allowMultipleImages
          />
        )}

        {campaignType === "both" && (
          <CampaignForm
            type="both"
            onTitleChange={handleBothInput}
            onObjectChange={handleBothInput}
            onDescriptionChange={(value) => {
              setEmailCampaign((prevData) => ({
                ...prevData,
                Description: value,
              }))
              setWhatsappCampaign((prevData) => ({
                ...prevData,
                Description: value,
              }))
            }}
            onImageChange={handleImageInput}
            allowMultipleImages
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="button" variant="bordered">
          Annulla
        </Button>
        <Button onPress={onOpen} color="primary" radius="sm">
          Salva
        </Button>
      </div>

      <ConfirmationModal isOpen={isOpen} onOpenChange={onOpenChange} onConfirm={handleSubmit} isLoading={isLoading} />

      {(campaignType === "email" || campaignType === "both") && (
        <PreviewMailModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          campaignData={{
            title: emailCampaign.Title,
            object: emailCampaign.Object,
            description: emailCampaign.Description,
            image: images ? URL.createObjectURL(images[0]) : undefined,
          }}
        />
      )}

      {(campaignType === "whatsapp" || campaignType === "both") && (
        <PreviewWhatsAppModal
          isOpen={whatsAppPreviewOpen}
          onClose={() => setWhatsAppPreviewOpen(false)}
          campaignData={{
            title: whatsappCampaign.Title,
            description: whatsappCampaign.Description,
            images: images || undefined,
          }}
        />
      )}
    </form>
  )
}