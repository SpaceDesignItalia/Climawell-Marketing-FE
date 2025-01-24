export interface EmailCampaign {
  EmailCampaignId: number;
  Title: string;
  Object: string;
  Description: string;
}

export interface ContactSelectorProps {
  onCapsSelect: (caps: Cap[]) => void
  onContactsSelect: (contacts: Contact[]) => void
  selectedCaps: Cap[]
  selectedContacts: Contact[]
}



export interface WhatsappCampaign {
  WhatsappCampaignId: number;
  Title: string;
  Description: string;
}

export interface Contact {
  code: string;
  name: string;
}

export interface Cap {
  Cap: string;
  City: string;
}

export interface PreviewMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData: {
    title: string;
    object: string;
    description: string;
    image?: string;
  };
}

export interface PreviewWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData: {
    title: string;
    description: string;
    images?: FileList;
  };
}

