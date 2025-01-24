import { RadioGroup } from "@heroui/react";
import { CustomRadio } from "./CustomRadio";

interface CampaignTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isWhatsappBlocked: boolean;
}

export function CampaignTypeSelector({ value, onChange, isWhatsappBlocked }: CampaignTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-5 sm:col-span-4">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900">
          Seleziona il tipo di campagna
        </h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          Scegli il tipo di campagna che vuoi iniziare. <br />
          Questa selezione ci aiuterà a personalizzare le informazioni richieste.
        </p>
      </div>

      <RadioGroup
        orientation="horizontal"
        description="Seleziona il tipo di campagna"
        value={value}
        onValueChange={onChange}
      >
        <CustomRadio
          description="Seleziona questa opzione per inviare la campagna via email."
          value="email"
        >
          <span className="flex items-center gap-2">📧 Email</span>
        </CustomRadio>
        {!isWhatsappBlocked ? (
          <>
            <CustomRadio
              description="Seleziona questa opzione per inviare la campagna via whatsapp."
              value="whatsapp"
            >
              <span className="flex items-center gap-2">💬 Whatsapp</span>
            </CustomRadio>
            <CustomRadio
              description="Seleziona questa opzione per inviare la campagna via email e via whatsapp."
              value="both"
            >
              <span className="flex items-center gap-2">🤝 Entrambi</span>
            </CustomRadio>
          </>
        ) : (
          <p className="mt-1 text-sm/6 text-gray-600">
            Campagna Whatsapp già in corso. Attendere il termine
          </p>
        )}
      </RadioGroup>
    </div>
  );
}

