import { Tabs, Tab, Switch } from "@heroui/react";
import StatsList from "../../Components/Contacts/Other/StatsList";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import ContactsTablePrivate from "../../Components/Contacts/Table/ContactsTablePrivate";
import ContactsTableCompany from "../../Components/Contacts/Table/ContactsTableCompany";
import { Button } from "@heroui/react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";

export default function Contacts() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalContacts, setTotalContacts] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isWhatsappBlock, setIsWhatsappBlock] = useState({ blocked: false });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const data = results.data;
          processCSVData(data);
        },
      });
    }
  };

  useEffect(() => {
    async function checkWhatsappBlock() {
      const res = await axios.get("/Campaigns/GET/CheckWhatsappBlock");
      if (res.status === 200) {
        setIsWhatsappBlock(res.data);
      }
    }
    checkWhatsappBlock();
  }, []);

  const processCSVData = (data: any[]) => {
    const uniqueData = Array.from(
      new Map(data.map((row) => [row.RagSoc, row])).values()
    );

    const companies = uniqueData
      .filter((row) => row.TpPersona === "G")
      .map((row) => ({
        CompanyName: row.RagSoc,
        CompanyEmail: row.EMail,
        CompanyPhone: row.Cellulare,
        Agente: row.JAgente,
        Cap: row.Cap,
      }));

    const customers = uniqueData
      .filter((row) => row.TpPersona === "F")
      .map((row) => {
        const [CustomerName, CustomerSurname] = row.RagSoc.split(" ", 2);
        return {
          CustomerName: CustomerName || "",
          CustomerSurname: CustomerSurname || "",
          CustomerEmail: row.EMail,
          CustomerPhone: row.Cellulare,
          Agente: row.JAgente,
          Cap: row.Cap,
        };
      });

    setTotalContacts(uniqueData.length);
    sendToBackendInChunks({ companies, customers });
  };

  const sendToBackendInChunks = useCallback(
    async (payload: { companies: any[]; customers: any[] }) => {
      const chunkSize = 500;
      const chunkedCompanies = chunkArray(payload.companies, chunkSize);
      const chunkedCustomers = chunkArray(payload.customers, chunkSize);

      try {
        for (const companyChunk of chunkedCompanies) {
          await axios.post(
            "/Contacts/POST/UploadContacts",
            { companies: companyChunk, customers: [] },
            { headers: { "Content-Type": "application/json" } }
          );
        }

        for (const customerChunk of chunkedCustomers) {
          await axios.post(
            "/Contacts/POST/UploadContacts",
            { companies: [], customers: customerChunk },
            { headers: { "Content-Type": "application/json" } }
          );
        }

        // Reload the page after successful upload
        window.location.reload();
      } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
        alert("Errore durante il caricamento dei dati.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const chunkArray = (array: any[], size: number): any[][] => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  return (
    <main className="lg:ml-72 py-10">
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
        <StatsList />
        <label htmlFor="file-upload">
          <div className="relative inline-block">
            <Button color="primary" disabled={isLoading}>
              {isLoading ? "Caricamento in corso..." : "Carica Contatti"}
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
          </div>
        </label>
        <div>
          <Tabs variant="underlined">
            <Tab
              key="privati"
              title={
                <div className="flex flex-row gap-2 items-center">
                  <PersonRoundedIcon /> Privati
                </div>
              }
            >
              <ContactsTablePrivate
                isPremium={isPremium}
                isWhatsappBlock={isWhatsappBlock.blocked}
              />
            </Tab>
            <Tab
              key="aziende"
              title={
                <div className="flex flex-row gap-2 items-center">
                  <ApartmentRoundedIcon /> Aziende
                </div>
              }
            >
              <ContactsTableCompany
                isPremium={isPremium}
                isWhatsappBlock={isWhatsappBlock.blocked}
              />
            </Tab>

            {isWhatsappBlock.blocked && (
              <Tab isDisabled>
                <p>Limite di messaggi giornaliero raggiunto</p>
              </Tab>
            )}
          </Tabs>

          {totalContacts !== null && (
            <p className="mt-4 text-sm text-gray-500">
              Totale contatti caricati: {totalContacts}
            </p>
          )}

          <Switch isSelected={isPremium} onValueChange={setIsPremium}>
            Mostra solo contatti premium
          </Switch>
        </div>
      </div>
    </main>
  );
}
