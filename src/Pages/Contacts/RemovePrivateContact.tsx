import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BgImage from "../../assets/bg-reset.jpg";
import { Button } from "@heroui/react";

export default function RemovePrivateContact() {
  const { CampaignToken: token } = useParams<{ CampaignToken: string }>();

  useEffect(() => {
    const deleteContact = async () => {
      await axios.post("/Contacts/POST/DeletePrivateContact", {
        CampaignToken: token,
      });
    };
    deleteContact();
  }, [token]);

  return (
    <main className="relative isolate h-screen">
      <img
        alt=""
        src={BgImage}
        className="absolute inset-0 -z-10 size-full object-cover brightness-50"
      />
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          Account rimosso con successo
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-white/70 sm:text-xl/8">
          Rimosso il contatto privato con il token: {token}
        </p>
        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            color="primary"
            as={"a"}
            href="https://www.climawell.net"
            className="text-sm/7 font-semibold text-white"
          >
            <span aria-hidden="true">&larr;</span> Torna al sito!
          </Button>
        </div>
      </div>
    </main>
  );
}
