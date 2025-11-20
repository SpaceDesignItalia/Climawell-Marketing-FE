import { Button, Input, Modal, ModalContent, Switch } from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function EditPrivateContactModal({
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
  const [surname, setSurname] = useState("");
  const [cap, setCap] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/Contacts/Get/GetPrivateById", {
          params: {
            id: contact.CustomerId,
          },
        })
        .then((res) => {
          setEmail(res.data.CustomerEmail);
          setPhone(res.data.CustomerPhone);
          setName(res.data.CustomerName);
          setSurname(res.data.CustomerSurname);
          setCap(res.data.Cap);
          setIsPremium(res.data.IsPremium);
          setIsBlocked(res.data.isBlocked);
        });
    };
    fetchData();
  }, [contact, isOpen]);

  async function handleUpdate() {
    try {
      const formData = {
        CustomerId: contact.CustomerId,
        CustomerEmail: email,
        CustomerPhone: phone,
        CustomerName: name,
        CustomerSurname: surname,
        Cap: cap,
        IsPremium: isPremium,
        IsBlocked: isBlocked,
      };
      await axios
        .post("/Contacts/POST/UpdateContact", {
          ContactData: formData,
          ContactType: "Private",
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
          <h1>Modifica del cliente Privato</h1>
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
            label="Surname"
            placeholder="Enter your surname"
            value={surname}
            onValueChange={(value) => setSurname(value)}
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
          <Switch
            isSelected={isBlocked}
            onValueChange={() => setIsBlocked(!isBlocked)}
          >
            Bloccato
          </Switch>
          <Button onClick={handleUpdate}>Salva</Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
