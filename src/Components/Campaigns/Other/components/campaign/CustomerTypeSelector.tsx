import { RadioGroup } from "@heroui/react";
import { CustomRadio } from "./CustomRadio";

interface CustomerTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomerTypeSelector({
  value,
  onChange,
}: CustomerTypeSelectorProps) {
  console.log("CustomerTypeSelector rendering, current value:", value);

  const handleChange = (newValue: string) => {
    console.log("CustomerTypeSelector - Cambio selezione a:", newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-5 sm:col-span-4">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900">
          Seleziona il tipo di cliente
        </h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          Scegli il tipo di cliente per cui stai iniziando la campagna. <br />
          Questa selezione ci aiuterà a personalizzare le informazioni
          richieste.
        </p>
      </div>

      <RadioGroup
        orientation="horizontal"
        description="Seleziona il tipo di cliente"
        value={value}
        onValueChange={handleChange}
      >
        <CustomRadio
          description="Seleziona questa opzione per inviare la campagna ai clienti privati."
          value="private"
        >
          <span className="flex items-center gap-2">🧑‍💻 Cliente Privato</span>
        </CustomRadio>
        <CustomRadio
          description="Seleziona questa opzione per inviare la campagna alle aziende."
          value="business"
        >
          <span className="flex items-center gap-2">🏢 Cliente Azienda</span>
        </CustomRadio>
        <CustomRadio
          description="Seleziona questa opzione per inviare la campagna ai clienti premium."
          value="premium"
        >
          <span className="flex items-center gap-2">🥇 Cliente Premium</span>
        </CustomRadio>
      </RadioGroup>
    </div>
  );
}
