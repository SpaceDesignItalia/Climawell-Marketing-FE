import { useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Switch,
  cn,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import axios from "axios";
import { contacts, tuscanyCaps } from "../../Campaigns/Other/utils/constants";

interface PrivateCustomer {
  CustomerName: string;
  CustomerSurname: string;
  CustomerEmail: string;
  CustomerPhone: string;
  PolicyAccepted: boolean;
  isPremium: boolean;
  Cap: number;
  Agente: string;
}

interface CompanyCustomer {
  CompanyName: string;
  CompanyEmail: string;
  CompanyPhone: string;
  CompanyVAT: string;
  isPremium: boolean;
  Cap: number;
  Agente: string;
}

const PRIVATECUSTOMER_INITIAL: PrivateCustomer = {
  CustomerName: "",
  CustomerSurname: "",
  CustomerEmail: "",
  CustomerPhone: "",
  PolicyAccepted: false,
  isPremium: false,
  Cap: 0,
  Agente: "",
};

const COMPANYCUSTOMER_INITIAL: CompanyCustomer = {
  CompanyName: "",
  CompanyEmail: "",
  CompanyPhone: "",
  CompanyVAT: "",
  isPremium: false,
  Cap: 0,
  Agente: "",
};

export const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 items-center justify-between flex-row-reverse max-w-[300px] cursor-pointer",
          "rounded-lg gap-4 p-4 border-2",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default function AddContactModel() {
  const [customerType, setCustomerType] = useState("private");
  const [privateCustomerData, setPrivateCustomerData] =
    useState<PrivateCustomer>(PRIVATECUSTOMER_INITIAL);
  const [companyCustomerData, setCompanyCustomerData] =
    useState<CompanyCustomer>(COMPANYCUSTOMER_INITIAL);
  const [privacyFile, setPrivacyFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrivateCustomerInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPrivateCustomerData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCompanyCustomerInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCompanyCustomerData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrivacyFile(e.target.files[0]);
    }
  };

  const handleKeyDownNumeric = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Delete",
    ];

    const input = e.target as HTMLInputElement;

    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }

    if (input.value.length >= 13 && /^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const CustomerData = new FormData();

      if (customerType === "private") {
        if (
          !privateCustomerData.CustomerName ||
          !privateCustomerData.CustomerSurname ||
          !privateCustomerData.CustomerEmail ||
          !privateCustomerData.CustomerPhone ||
          !privateCustomerData.Agente ||
          !privateCustomerData.Cap
        ) {
          throw new Error("Per favore compila tutti i campi obbligatori");
        }

        if (!privateCustomerData.PolicyAccepted) {
          throw new Error("È necessario accettare la privacy per procedere");
        }

        CustomerData.append("ContactData", JSON.stringify(privateCustomerData));
        CustomerData.append("ContactType", customerType);
        if (privacyFile) {
          CustomerData.append("file", privacyFile);
        }
      } else {
        if (
          !companyCustomerData.CompanyName ||
          !companyCustomerData.CompanyEmail ||
          !companyCustomerData.CompanyPhone ||
          !companyCustomerData.CompanyVAT ||
          !companyCustomerData.Agente ||
          !companyCustomerData.Cap
        ) {
          throw new Error("Per favore compila tutti i campi obbligatori");
        }

        CustomerData.append("ContactData", JSON.stringify(companyCustomerData));
        CustomerData.append("ContactType", customerType);
      }

      const res = await axios.post(
        "/Contacts/POST/AddNewContact",
        CustomerData
      );

      if (res.status === 201) {
        window.location.href = "/Contacts";
      }
    } catch (error: any) {
      console.error("Si è verificato un errore:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          setError(
            error.response.data ||
              "Si è verificato un errore durante l'aggiunta del contatto. Riprova più tardi."
          );
        } else {
          setError(
            "Si è verificato un errore di rete. Verifica la tua connessione e riprova."
          );
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Si è verificato un errore imprevisto. Riprova più tardi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderContactSelectors = (isCompany: boolean) => {
    const setData = isCompany ? setCompanyCustomerData : setPrivateCustomerData;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-4 sm:col-span-4">
          <Autocomplete
            className="w-full"
            defaultItems={tuscanyCaps}
            label="Seleziona zona (CAP)"
            size="sm"
            variant="bordered"
            placeholder="Cerca per CAP o città"
            onSelectionChange={(value) => {
              const selectedCap = tuscanyCaps.find((c) => c.Cap === value);
              if (selectedCap) {
                setData((prev: any) => ({
                  ...prev,
                  Cap: Number(selectedCap.Cap),
                }));
              }
            }}
          >
            {(item) => (
              <AutocompleteItem
                key={item.Cap}
                textValue={`${item.Cap} - ${item.City}`}
              >
                <div className="flex justify-between">
                  <span>{item.City}</span>
                  <span className="text-default-400">{item.Cap}</span>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>

          <Autocomplete
            className="w-full"
            defaultItems={contacts}
            label="Seleziona agente"
            size="sm"
            variant="bordered"
            placeholder="Cerca per nome o codice"
            onSelectionChange={(value) => {
              const contact = contacts.find((c) => c.code === value);
              if (contact) {
                setData((prev: any) => ({ ...prev, Agente: contact.code }));
              }
            }}
          >
            {(contact) => (
              <AutocompleteItem
                key={contact.code}
                textValue={`${contact.code} - ${contact.name}`}
              >
                <div className="flex justify-between">
                  <span>{contact.name}</span>
                  <span className="text-default-400">#{contact.code}</span>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5 space-y-12">
        {/* Tipo di cliente */}
        <div className="flex flex-col gap-5 sm:col-span-4">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              Seleziona il tipo di cliente
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Scegli il tipo di cliente per cui stai inserendo i dati. <br />
              Questa selezione ci aiuterà a personalizzare le informazioni
              richieste.
            </p>
          </div>

          <RadioGroup
            orientation="horizontal"
            description="Seleziona il tipo di cliente"
            defaultValue="private"
            onValueChange={setCustomerType}
          >
            <CustomRadio
              description="Seleziona questa opzione per inserire i dati di un cliente privato."
              value="private"
            >
              <span className="flex items-center gap-2">
                🧑‍💻 Cliente Privato
              </span>
            </CustomRadio>
            <CustomRadio
              description="Seleziona questa opzione per inserire i dati di un azienda."
              value="business"
            >
              <span className="flex items-center gap-2">
                🏢 Cliente Azienda
              </span>
            </CustomRadio>
          </RadioGroup>

          <div className="sm:col-span-3">
            <label
              htmlFor="CustomerName"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Contatto premium
            </label>
            <div className="mt-2">
              <Switch
                checked={privateCustomerData.isPremium}
                onValueChange={(e) => {
                  setCompanyCustomerData({
                    ...companyCustomerData,
                    isPremium: e,
                  });

                  setPrivateCustomerData({
                    ...privateCustomerData,
                    isPremium: e,
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* Dati cliente privato */}
        {customerType === "private" && (
          <>
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Inserisci i dati personali del cliente
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Compila i dettagli del cliente privato. Queste informazioni
                serviranno per la registrazione.
              </p>

              {renderContactSelectors(false)}

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="CustomerName"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Nome
                  </label>
                  <div className="mt-2">
                    <Input
                      id="CustomerName"
                      name="CustomerName"
                      type="text"
                      autoComplete="given-name"
                      variant="bordered"
                      radius="sm"
                      placeholder="Inserisci il nome del cliente"
                      onChange={handlePrivateCustomerInput}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="CustomerSurname"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Cognome
                  </label>
                  <div className="mt-2">
                    <Input
                      id="CustomerSurname"
                      name="CustomerSurname"
                      type="text"
                      autoComplete="family-name"
                      variant="bordered"
                      radius="sm"
                      placeholder="Inserisci il cognome del cliente"
                      onChange={handlePrivateCustomerInput}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="CustomerEmail"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Indirizzo Email
                  </label>
                  <div className="mt-2">
                    <Input
                      id="CustomerEmail"
                      name="CustomerEmail"
                      type="email"
                      autoComplete="email"
                      variant="bordered"
                      radius="sm"
                      placeholder="Inserisci l'email del cliente"
                      onChange={handlePrivateCustomerInput}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="CustomerPhone"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Numero di Telefono
                  </label>
                  <div className="mt-2">
                    <Input
                      id="CustomerPhone"
                      name="CustomerPhone"
                      autoComplete="tel"
                      variant="bordered"
                      radius="sm"
                      placeholder="Inserisci il numero di telefono"
                      onKeyDown={handleKeyDownNumeric}
                      onChange={handlePrivateCustomerInput}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy e caricamento documento */}
            <div className="flex flex-col gap-5 border-b border-gray-900/10 pb-12">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900">
                  Privacy
                </h2>
                <p className="text-sm/6 text-gray-600">
                  Conferma che il cliente ha accettato i termini della privacy.
                </p>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Checkbox
                    isSelected={privateCustomerData.PolicyAccepted}
                    onValueChange={(checked) =>
                      setPrivateCustomerData((prev) => ({
                        ...prev,
                        PolicyAccepted: checked,
                      }))
                    }
                  >
                    Confermo che il cliente ha accettato la privacy
                  </Checkbox>
                </div>

                <div>
                  <label
                    htmlFor="privacy-document"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Carica il documento di accettazione della privacy
                  </label>
                  <div className="mt-2">
                    <Input
                      id="privacy-document"
                      name="privacy-document"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      variant="bordered"
                      radius="sm"
                      onChange={handleFileInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dati cliente aziendale */}
        {customerType === "business" && (
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">
              Inserisci i dati aziendali
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Compila i dati dell'azienda. Queste informazioni saranno
              utilizzate per la registrazione aziendale.
            </p>

            {renderContactSelectors(true)}

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="company-name"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Nome dell'Azienda
                </label>
                <div className="mt-2">
                  <Input
                    id="company-name"
                    name="CompanyName"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    placeholder="Inserisci il nome dell'azienda"
                    onChange={handleCompanyCustomerInput}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Indirizzo Email Aziendale
                </label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="CompanyEmail"
                    type="email"
                    autoComplete="email"
                    variant="bordered"
                    radius="sm"
                    placeholder="Inserisci l'email aziendale"
                    onChange={handleCompanyCustomerInput}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="phone-number"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Numero di Telefono Aziendale
                </label>
                <div className="mt-2">
                  <Input
                    id="phone-number"
                    name="CompanyPhone"
                    autoComplete="phone"
                    variant="bordered"
                    radius="sm"
                    placeholder="Inserisci il numero di telefono aziendale"
                    onKeyDown={handleKeyDownNumeric}
                    onChange={handleCompanyCustomerInput}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="vat-number"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Partita IVA
                </label>
                <div className="mt-2">
                  <Input
                    id="vat-number"
                    name="CompanyVAT"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    placeholder="Inserisci la partita IVA"
                    onChange={handleCompanyCustomerInput}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error message display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="button" variant="bordered" disabled={isSubmitting}>
          Annulla
        </Button>
        <Button
          type="submit"
          color="primary"
          radius="sm"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvataggio..." : "Salva"}
        </Button>
      </div>
    </form>
  );
}
