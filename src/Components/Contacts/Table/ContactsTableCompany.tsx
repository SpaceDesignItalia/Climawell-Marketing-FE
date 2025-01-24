import React, { useEffect, useState } from "react"
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
  Link,
  Spinner,
} from "@heroui/react"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded"
import AddBusinessIcon from "@mui/icons-material/AddBusiness"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import { Edit } from "@mui/icons-material"
import axios from "axios"
import EditCompanyContactModal from "../Other/EditCompanyContactModal"

interface Company {
  CompanyId: number
  CompanyName: string
  CompanyEmail?: string
  CompanyPhone?: string
  Agente: string
}

const columns = [
  { name: "Nome Azienda", uid: "CompanyName" },
  { name: "Email Azienda", uid: "CompanyEmail" },
  { name: "Telefono Azienda", uid: "CompanyPhone" },
  { name: "Agente", uid: "Agente" },
  { name: "Cap", uid: "Cap" },
  { name: "Azioni", uid: "actions" },
]

interface ContactsTableCompanyProps {
  isPremium: boolean
}

export default function ContactsTableCompany({ isPremium }: ContactsTableCompanyProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [companies, setCompany] = useState<Company[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updateContact, setUpdateContact] = useState(false)
  const [page, setPage] = useState(1)
  const [modalData, setModalData] = useState<{
    Customer: Company
    open: boolean
  }>({
    Customer: {
      CompanyId: 0,
      CompanyName: "",
      CompanyEmail: "",
      CompanyPhone: "",
      Agente: "",
    },
    open: false,
  })

  useEffect(() => {
    setSearchTerm("")
    fetchData()
  }, [isPremium, updateContact])

  async function fetchData() {
    try {
      setIsLoading(true)
      setError(null)
      const res = await axios.get("/Contacts/GET/GetAllCompany", {
        params: { isPremium: isPremium || false },
      })

      if (res.status === 200) {
        setCompany(res.data)
      }
    } catch (error) {
      console.error("Errore durante il caricamento delle aziende:", error)
      setError("Si è verificato un errore durante il caricamento delle aziende")
    } finally {
      setIsLoading(false)
    }
  }

  async function SearchCustomer() {
    try {
      setIsSearching(true)
      setError(null)
      const response = await axios.get("/Contacts/GET/SearchCompanyContactByEmail", {
        params: { CustomerEmail: searchTerm, isPremium },
      })
      setCompany(response.data)
    } catch (error) {
      console.error("Errore durante la ricerca delle aziende:", error)
      setError("Si è verificato un errore durante la ricerca")
    } finally {
      setIsSearching(false)
    }
  }

  

  const pages = Math.ceil(companies.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return companies.slice(start, end)
  }, [page, companies, rowsPerPage])

  const renderCell = React.useCallback(
    (customer: Company, columnKey: React.Key) => {
      const cellValue = customer[columnKey as keyof Company]

      switch (columnKey) {
        case "CompanyPhone":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue == null ? "Non presente" : cellValue}</p>
            </div>
          )
        case "actions":
          return (
            <div className="flex flex-row gap-3">
              <Button
                color="primary"
                radius="full"
                startContent={<Edit className="h-3 w-3" />}
                onClick={() => {
                  setModalData({
                    Customer: customer,
                    open: true,
                  })
                }}
                size="sm"
                isIconOnly
                isDisabled={isLoading}
              />
            </div>
          )
        default:
          return cellValue
      }
    },
    [isLoading],
  )

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between gap-3 items-end">
          <div className="flex flex-row gap-3 w-full">
            <Input
              radius="full"
              variant="bordered"
              startContent={<SearchOutlinedIcon className="text-gray-400" />}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (e.target.value.trim() === "") {
                  fetchData()
                }
              }}
              value={searchTerm}
              className="md:w-1/3"
              placeholder="Cerca contatto per nome..."
              disabled={isLoading}
            />
            <Button
              color="primary"
              radius="full"
              endContent={isSearching ? <Spinner size="sm" /> : <SearchOutlinedIcon />}
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
              startContent={<AddBusinessIcon />}
              className="hidden sm:flex"
              isDisabled={isLoading}
            >
              Aggiungi contatto
            </Button>
            <Button
              as={Link}
              href="./contacts/add-new-contact"
              color="primary"
              radius="full"
              isIconOnly
              className="sm:hidden"
              isDisabled={isLoading}
            >
              <AddBusinessIcon />
            </Button>
          </div>
        </div>
      </div>
    )
  }, [onRowsPerPageChange, companies.length, searchTerm, isLoading, isSearching])

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          radius="full"
          page={page}
          total={pages || 1}
          onChange={setPage}
          className="w-full flex justify-center"
          isDisabled={isLoading}
        />
      </div>
    )
  }, [items.length, page, pages, isLoading])

  const loadingContent = (
    <div className="flex flex-col items-center justify-center p-10 gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">Caricamento aziende in corso...</p>
    </div>
  )

  const errorContent = error && (
    <div className="text-center p-10">
      <ApartmentRoundedIcon sx={{ fontSize: 50, color: "red" }} />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Si è verificato un errore</h3>
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
  )

  return (
    <div className="bg-white">
      <EditCompanyContactModal
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
        topContent={topContent}
        topContentPlacement="inside"
        classNames={{
          wrapper: "border rounded-lg shadow-none",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
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
                <ApartmentRoundedIcon sx={{ fontSize: 50 }} />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Nessun azienda trovata!</h3>
                <p className="mt-1 text-sm text-gray-500">Inizia aggiungendo una nuova azienda al database.</p>
                <div className="mt-6">
                  <Button
                    as={Link}
                    href="./contacts/add-new-contact"
                    color="primary"
                    radius="full"
                    startContent={<AddRoundedIcon />}
                  >
                    Aggiungi contatto
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-10">
                <ApartmentRoundedIcon sx={{ fontSize: 50 }} />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Nessun contatto trovato!</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Nessun risultato corrisponde alla tua ricerca:{" "}
                  <span className="font-semibold italic">{searchTerm}</span>
                </p>
              </div>
            )
          }
          items={items}
        >
          {(item) => (
            <TableRow key={item.CompanyId}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

