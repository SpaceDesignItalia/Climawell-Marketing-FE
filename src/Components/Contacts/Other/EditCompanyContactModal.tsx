import { Button, Input, Modal, ModalContent, Switch } from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function EditCompanyContactModal({
  isOpen,
  isClosed,
  contact,
  setUpdateContact,
}: {
  isOpen: boolean;
  isClosed: () => void;
  contact: any;
  setUpdateContact: (value: any) => void;
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [cap, setCap] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/Contacts/Get/GetCompanyById", {
          params: {
            id: contact.CompanyId,
          },
        })
        .then((res) => {
          setEmail(res.data.CompanyEmail);
          setPhone(res.data.CompanyPhone);
          setName(res.data.CompanyName);
          setCap(res.data.Cap);
          setIsPremium(res.data.IsPremium);
        });
    };
    fetchData();
  }, [contact, isOpen]);

  async function handleUpdate() {
    try {
      const formData = {
        CompanyId: contact.CompanyId,
        CompanyEmail: email,
        CompanyPhone: phone,
        CompanyName: name,
        Cap: cap,
        IsPremium: isPremium,
      };
      await axios
        .post("/Contacts/POST/UpdateContact", {
          ContactData: formData,
          ContactType: "Business",
        })
        .then(() => {
          setUpdateContact((prev: any) => !prev);
          isClosed();
        });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={isClosed} title="Edit Contact">
      <ModalContent>
        <div className="flex flex-col gap-4 p-10">
          <h1>Modifica del cliente Azienda</h1>
          {email}
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onValueChange={(value) => setEmail(value)}
          />
          <Input
            label="Phone"
            placeholder="Enter your phone"
            value={phone}
            onValueChange={(value) => setPhone(value)}
          />
          <Input
            label="Name"
            placeholder="Enter your name"
            value={name}
            onValueChange={(value) => setName(value)}
          />
          <Input
            label="Cap"
            placeholder="Enter your cap"
            value={cap}
            onValueChange={(value) => setCap(value)}
          />
          <Switch
            isSelected={isPremium}
            onValueChange={() => setIsPremium(!isPremium)}
          >
            Cliente Premium
          </Switch>
          <Button onClick={handleUpdate}>Salva</Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
