import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  type SortDescriptor,
  Link,
  Spinner,
} from "@heroui/react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import EditPrivateContactModal from "../Other/EditPrivateContactModal";
import { contacts as agentList } from "../../Campaigns/Other/utils/constants";

interface Customer {
  CustomerId: number;
  CustomerFullName: string;
  CustomerEmail?: string;
  CustomerPhone?: string;
  PolicyAccepted: boolean;
  Agente: string;
  Cap?: string;
}

const columns = [
  { name: "Nome Cliente", uid: "CustomerFullName" },
  { name: "Email Cliente", uid: "CustomerEmail" },
  { name: "Telefono Cliente", uid: "CustomerPhone" },
  { name: "Agente", uid: "Agente" },
  { name: "Cap", uid: "Cap" },
  { name: "Azioni", uid: "actions" },
];

interface ContactsTablePrivateProps {
  isPremium: boolean;
  isWhatsappBlock: boolean;
}

export default function ContactsTablePrivate({
  isPremium,
  isWhatsappBlock,
}: ContactsTablePrivateProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<"email" | "agent" | "phone">("email");
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [updateContact, setUpdateContact] = useState(false);
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState<{
    Customer: Customer;
    open: boolean;
  }>({
    Customer: {
      CustomerId: 0,
      CustomerFullName: "",
      CustomerEmail: "",
      CustomerPhone: "",
      Agente: "",
      PolicyAccepted: false,
 
    },
    open: false,
  });

  useEffect(() => {
    setSearchTerm("");
    fetchData();
  }, [isPremium, updateContact]);

  async function fetchData() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("/Contacts/GET/GetAllPrivate", {
        params: { isPremium },
      });
      console.log("Risposta API:", response.data);
      setContacts(response.data);
    } catch (error) {
      console.error("Errore durante il caricamento dei contatti:", error);
      setError("Si è verificato un errore durante il caricamento dei contatti");
    } finally {
      setIsLoading(false);
    }
  }

  const normalizePhone = (value?: string) => (value || "").replace(/\D+/g, "");

  async function SearchCustomer() {
    try {
      setIsSearching(true);
      setError(null);
      
      if (searchType === "email") {
        const response = await axios.get("/Contacts/GET/SearchPrivateContactByEmail", {
          params: { CustomerEmail: searchTerm, isPremium }
        });
        console.log("Risultato ricerca per email:", response.data);
        setContacts(response.data);
      } else if (searchType === "agent") {
        const response = await axios.get("/Contacts/GET/GetAllPrivate", {
          params: { isPremium }
        });
        const filteredContacts = response.data.filter((contact: Customer) => 
          contact.Agente.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log("Risultato ricerca per agente:", filteredContacts);
        setContacts(filteredContacts);
      } else {
        const response = await axios.get("/Contacts/GET/GetAllPrivate", {
          params: { isPremium }
        });
        const term = normalizePhone(searchTerm);
        const filteredContacts = response.data.filter((contact: Customer) => {
          const phone = normalizePhone(contact.CustomerPhone);
          return term.length > 0 && phone.includes(term);
        });
        console.log("Risultato ricerca per telefono:", filteredContacts);
        setContacts(filteredContacts);
      }
    } catch (error) {
      console.error("Errore durante la ricerca dei contatti:", error);
      setError("Si è verificato un errore durante la ricerca");
    } finally {
      setIsSearching(false);
    }
  }

  const cycleSearchType = () => {
    if (searchType === "email") return setSearchType("agent");
    if (searchType === "agent") return setSearchType("phone");
    return setSearchType("email");
  };

  const searchPlaceholder =
    searchType === "email"
      ? "Cerca cliente per email..."
      : searchType === "agent"
      ? "Cerca cliente per codice agente..."
      : "Cerca cliente per numero di telefono...";

  const searchTypeLabel =
    searchType === "email" ? "Per Email" : searchType === "agent" ? "Per Agente" : "Per Telefono";

  const getAgentName = (agentCode: string) => {
    const agent = agentList.find(a => a.code === agentCode);
    return agent ? agent.name : agentCode;
  };

  const pages = Math.ceil(contacts.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return contacts.slice(start, end);
  }, [page, contacts, rowsPerPage]);

  const renderCell = React.useCallback(
    (customer: Customer, columnKey: React.Key) => {
      const cellValue = customer[columnKey as keyof Customer];

      switch (columnKey) {
        case "CustomerPhone":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {cellValue == null ? "Non presente" : cellValue}
              </p>
            </div>
          );
        case "Agente":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {getAgentName(customer.Agente)}
                {customer.Agente && (
                  <span className="text-gray-400 text-xs ml-1">
                    (#{customer.Agente})
                  </span>
                )}
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="flex flex-row gap-3">
              <Button
                color="primary"
                radius="lg"
                startContent={<Edit className="h-3 w-3" />}
                onClick={() => {
                  setModalData({
                    Customer: customer,
                    open: true,
                  });
                }}
                size="sm"
                isIconOnly
              />
            </div>
          );
        case "PolicyAccepted":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {cellValue ? "Accettata" : "Non accettata"}
              </p>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between gap-3 items-end">
          <div className="flex flex-row gap-3 w-full">
            <div className="flex flex-row gap-2 md:w-1/3">
              <Input
                radius="full"
                variant="bordered"
                startContent={<SearchOutlinedIcon className="text-gray-400" />}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim() === "") {
                    fetchData();
                  }
                }}
                value={searchTerm}
                className="w-full"
                placeholder={searchPlaceholder}
                disabled={isLoading}
              />
              <Button
                radius="full"
                variant="flat"
                onClick={cycleSearchType}
                className="min-w-[120px]"
              >
                {searchTypeLabel}
              </Button>
            </div>
            <Button
              color="primary"
              radius="full"
              endContent={
                isSearching ? <Spinner size="sm" /> : <SearchOutlinedIcon />
              }
              isDisabled={searchTerm === "" || isLoading || isSearching}
              onClick={SearchCustomer}
              className="hidden sm:flex"
            >
              {isSearching ? "Ricerca..." : "Cerca"}
            </Button>
            <Button
              color="primary"
              radius="full"
              isDisabled={searchTerm === "" || isLoading || isSearching}
              onClick={SearchCustomer}
              className="sm:hidden"
              isIconOnly
            >
              {isSearching ? <Spinner size="sm" /> : <SearchOutlinedIcon />}
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              as={Link}
              href="./contacts/add-new-contact"
              color="primary"
              radius="full"
              startContent={<PersonAddAlt1RoundedIcon />}
              className={
                isWhatsappBlock
                  ? "hidden sm:flex bg-gray-400 cursor-not-allowed"
                  : "hidden sm:flex"
              }
              isDisabled={isLoading || isWhatsappBlock}
            >
              Aggiungi privato
            </Button>
            <Button
              as={Link}
              href="./contacts/add-new-contact"
              color="primary"
              radius="full"
              isIconOnly
              className={
                isWhatsappBlock
                  ? "sm:hidden bg-gray-400 cursor-not-allowed"
                  : "sm:hidden"
              }
              isDisabled={isLoading || isWhatsappBlock}
            >
              <PersonAddAlt1RoundedIcon />
            </Button>
          </div>
        </div>
      </div>
    );
  }, [
    onRowsPerPageChange,
    contacts.length,
    searchTerm,
    isLoading,
    isSearching,
    searchType,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          radius="lg"
          page={page}
          total={pages || 1}
          onChange={setPage}
          className="w-full flex justify-center"
          isDisabled={isLoading}
        />
      </div>
    );
  }, [items.length, page, pages, isLoading]);

  const loadingContent = (
    <div className="flex flex-col items-center justify-center p-10 gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">Caricamento contatti in corso...</p>
    </div>
  );

  const errorContent = error && (
    <div className="text-center p-10">
      <PersonAddAlt1RoundedIcon sx={{ fontSize: 50, color: "red" }} />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        Si è verificato un errore
      </h3>
      <p className="mt-1 text-sm text-red-500">{error}</p>
      <div className="mt-6">
        <Button
          color="primary"
          radius="full"
          onClick={fetchData}
          startContent={!isLoading && <AddRoundedIcon />}
          isLoading={isLoading}
        >
          Riprova
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <EditPrivateContactModal
        isOpen={modalData.open}
        isClosed={() => setModalData({ ...modalData, open: false })}
        contact={modalData.Customer}
        setUpdateContact={setUpdateContact}
      />
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        isStriped
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="inside"
        onSortChange={setSortDescriptor}
        classNames={{
          wrapper: "border rounded-lg shadow-none",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={loadingContent}
          emptyContent={
            error ? (
              errorContent
            ) : searchTerm === "" ? (
              <div className="text-center p-10">
                <PersonAddAlt1RoundedIcon sx={{ fontSize: 50 }} />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Nessun privato trovato!
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Inizia aggiungendo un nuovo privato al database.
                </p>
                <div className="mt-6">
                  <Button
                    as={Link}
                    color="primary"
                    radius="full"
                    href="./contacts/add-new-contact"
                    startContent={<AddRoundedIcon />}
                    isDisabled={isWhatsappBlock}
                    className={
                      isWhatsappBlock ? "bg-gray-400 cursor-not-allowed" : ""
                    }
                  >
                    Aggiungi privato
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-10">
                <PersonAddAlt1RoundedIcon sx={{ fontSize: 50 }} />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Nessun cliente trovato!
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Nessun risultato corrisponde alla tua ricerca:{" "}
                  <span className="font-semibold italic">{searchTerm}</span>
                  {searchType === "agent" && " (codice agente)"}
                  {searchType === "phone" && " (telefono)"}
                </p>
              </div>
            )
          }
          items={items}
        >
          {(item) => (
            <TableRow key={item.CustomerId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
