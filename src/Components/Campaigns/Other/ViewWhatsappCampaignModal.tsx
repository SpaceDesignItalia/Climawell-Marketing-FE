'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Image,
} from "@heroui/react"

interface WhatsappCampaign {
  WhatsappCampaignId: number;
  Title: string;
  Description: string;
  Date: string;
  Images?: string[];
}

interface ViewWhatsappCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: WhatsappCampaign;
}

export default function ViewWhatsappCampaignModal({ 
  isOpen, 
  onClose, 
  campaign 
}: ViewWhatsappCampaignModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{campaign.Title}</h2>
          <p className="text-sm text-gray-500">
            Creata il {new Date(campaign.Date).toLocaleDateString()}
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <Card>
              <CardBody>
                <h3 className="text-sm font-medium text-gray-500">Descrizione</h3>
                <div 
                  className="mt-1 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: campaign.Description }}
                />
              </CardBody>
            </Card>

            {campaign.Images && campaign.Images.length > 0 && (
              <Card>
                <CardBody>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Immagini della Campagna</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {campaign.Images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Immagine ${index + 1} della campagna`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardBody>
                <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID Campagna</dt>
                    <dd className="mt-1 text-sm text-gray-900">{campaign.WhatsappCampaignId}</dd>
                  </div>
                </dl>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Chiudi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

