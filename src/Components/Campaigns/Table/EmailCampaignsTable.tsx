// @ts-nocheck
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
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Link,
} from "@heroui/react";
import CampaignIcon from "@mui/icons-material/Campaign";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import axios from "axios";
import ViewCampaignModal from "../Other/ViewMailCampaignModal";

interface EmailCampaign {
  EmailCampaignId: number;
  Title: string;
  Date: string;
  Object?: string;
  Description?: string;
}

interface ModalData {
  Campaign: EmailCampaign;
  open: boolean;
}

interface ModalDeleteData {
  Campaign: EmailCampaign;
  open: boolean;
}

const columns = [
  { name: "Titolo campagna", uid: "Title" },
  { name: "Data", uid: "Date" },
];

export default function EmailCampaignsTable() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState<ModalData>({
    Campaign: {
      EmailCampaignId: 0,
      Title: "",
      Date: "",
      Object: "",
      Description: "",
    },
    open: false,
  });
  const [modalDeleteData, setModalDeleteData] = useState<ModalDeleteData>({
    Campaign: {
      EmailCampaignId: 0,
      Title: "",
      Date: "",
    },
    open: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios.get("/Campaigns/GET/GetAllEmailCampaigns").then((res) => {
      setCampaigns(res.data);
    });
  }

  async function SearchCampaign() {
    try {
      const response = await axios.get(
        "/Campaigns/GET/SearchEmailCampaignByTitle",
        {
          params: { Title: searchTerm },
        }
      );
      setCampaigns(response.data);
    } catch (error) {
      console.error("Errore durante la ricerca della campagna:", error);
    }
  }

  async function DeleteCampaign(EmailCampaignId: Number) {
    try {
      const res = await axios.delete("/Campaigns/DELETE/DeleteEmailCampaign", {
        params: { EmailCampaignId: EmailCampaignId },
      });

      if (res.status === 200) {
        setAlertData({
          isOpen: true,
          onClose: () => setAlertData((prev) => ({ ...prev, isOpen: false })),
          alertTitle: "Successo",
          alertDescription: "campagna eliminata con successo!",
          alertColor: "green",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Errore nella cancellazione della campagna:", error);
      setAlertData({
        isOpen: true,
        onClose: () => setAlertData((prev) => ({ ...prev, isOpen: false })),
        alertTitle: "Errore",
        alertDescription:
          "Si è verificato un errore durante la cancellazione della campagna. Riprova più tardi.",
        alertColor: "red",
      });
    }
  }

  const pages = Math.ceil(campaigns.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return campaigns.slice(start, end);
  }, [page, campaigns, rowsPerPage]);

  const renderCell = React.useCallback(
    (campaign: EmailCampaign, columnKey: React.Key) => {
      const cellValue = campaign[columnKey as keyof EmailCampaign];

      switch (columnKey) {
        case "Title":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {cellValue == null ? "Non presente" : cellValue}
              </p>
            </div>
          );
        case "Date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {new Date(cellValue).toLocaleDateString()}
              </p>
            </div>
          );

        default:
          return cellValue;
      }
    },
    []
  );

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
                setSearchTerm(e.target.value);
                if (e.target.value.trim() === "") {
                  fetchData();
                }
              }}
              value={searchTerm}
              className="md:w-1/3"
              placeholder="Cerca campagna per titolo..."
            />
            <Button
              color="primary"
              radius="full"
              endContent={<SearchOutlinedIcon />}
              isDisabled={searchTerm == ""}
              onClick={SearchCampaign}
              className="hidden sm:flex"
            >
              Cerca
            </Button>
            <Button
              color="primary"
              radius="full"
              isDisabled={searchTerm == ""}
              onClick={SearchCampaign}
              className="sm:hidden"
              isIconOnly
            >
              <SearchOutlinedIcon />
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              as={Link}
              href="./campaigns/add-new-campaign"
              color="primary"
              radius="full"
              startContent={<CampaignIcon />}
              className="hidden sm:flex"
            >
              Crea campagna
            </Button>
            <Button
              as={Link}
              href="./campaign/add-new-campaign"
              color="primary"
              radius="full"
              isIconOnly
              className="sm:hidden"
            >
              <CampaignIcon />
            </Button>
          </div>
        </div>
      </div>
    );
  }, [searchTerm, SearchCampaign]);

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
        />
      </div>
    );
  }, [page, pages]);

  return (
    <div className="bg-white">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        isStriped
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        topContent={topContent}
        topContentPlacement="inside"
        radius="full"
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
          emptyContent={
            searchTerm == "" ? (
              <div className="text-center p-10">
                <ApartmentRoundedIcon sx={{ fontSize: 50 }} />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Nessuna campagna trovata!
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Inizia creando una nuova campagna.
                </p>
                <div className="mt-6">
                  <Button
                    color="primary"
                    radius="full"
                    startContent={<AddRoundedIcon />}
                  >
                    Crea campagna
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-10">
                <ApartmentRoundedIcon sx={{ fontSize: 50 }} />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Nessuna campagna trovata!
                </h3>
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
            <TableRow key={item.EmailCampaignId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ViewCampaignModal
        isOpen={modalData.open}
        onClose={() => setModalData({ ...modalData, open: false })}
        campaign={modalData.Campaign}
      />
    </div>
  );
}
