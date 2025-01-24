import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@heroui/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Conferma l'invio della campagna
            </ModalHeader>
            <ModalBody>
              <p>
                Stai per inviare la campagna ai destinatari selezionati.
                Assicurati che tutte le informazioni siano corrette prima di
                procedere.
              </p>
              <p>
                Una volta inviata, non sarà possibile annullare l'invio.
                Controlla con attenzione i dettagli della campagna.
              </p>
              <p>
                Se hai dei dubbi, puoi annullare e verificare i dettagli o
                contattare il supporto per assistenza.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Chiudi
              </Button>
              <Button
                isLoading={isLoading}
                onClick={onConfirm}
                color="primary"
                onPress={onClose}
              >
                Invia campagna
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

