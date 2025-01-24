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
} from "@heroui/react"

interface ViewCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: {
    EmailCampaignId: number
    Title: string
    Object?: string
    Description: string
    Date: string
  }
}

export default function ViewCampaignModal({ isOpen, onClose, campaign }: ViewCampaignModalProps) {
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
            {campaign.Object && (
              <Card>
                <CardBody>
                  <h3 className="text-sm font-medium text-gray-500">Oggetto</h3>
                  <p className="mt-1">{campaign.Object}</p>
                </CardBody>
              </Card>
            )}
            
            <Card>
              <CardBody>
                <h3 className="text-sm font-medium text-gray-500">Descrizione</h3>
                <div 
                  className="mt-1 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: campaign.Description }}
                />
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="text-sm font-medium text-gray-500">Dettagli</h3>
                <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID Campagna</dt>
                    <dd className="mt-1 text-sm text-gray-900">{campaign.EmailCampaignId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Andra metti una prewie o un qualcosa della foto bo non so</dt>
                    <dd className="mt-1 text-sm text-gray-900"></dd>
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
