import { Input } from "@heroui/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface CampaignFormProps {
  type: "email" | "whatsapp" | "both";
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onObjectChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allowMultipleImages?: boolean;
}

export function CampaignForm({
  type,
  onTitleChange,
  onObjectChange,
  onDescriptionChange,
  onImageChange,
  allowMultipleImages = false,
}: CampaignFormProps) {
  const title = type === "email" ? "email" : type === "whatsapp" ? "whatsapp" : "entrambi";

  return (
    <>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base/7 font-semibold text-gray-900">
          Inserisci i dati della campagna {title}
        </h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          Compila i dettagli della campagna {title}. Queste informazioni
          saranno utilizzate per la creazione della campagna.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="CampaignTitle"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Titolo
            </label>
            <div className="mt-2">
              <Input
                id="CampaignTitle"
                name="Title"
                type="text"
                autoComplete="given-name"
                variant="bordered"
                radius="sm"
                placeholder="Inserisci il nome della campagna"
                onChange={onTitleChange}
              />
            </div>
          </div>
          {(type === "email" || type === "both") && (
            <div className="sm:col-span-3">
              <label
                htmlFor="CampaignObject"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Oggetto
              </label>
              <div className="mt-2">
                <Input
                  id="CampaignObject"
                  name="Object"
                  type="text"
                  variant="bordered"
                  radius="sm"
                  placeholder="Inserisci l'oggetto della campagna"
                  onChange={onObjectChange}
                />
              </div>
            </div>
          )}
          <div className="sm:col-span-3">
            <label
              htmlFor="CampaignDescription"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Descrizione
            </label>
            <div className="mt-2">
              <ReactQuill
                theme="snow"
                id="CampaignDescription"
                placeholder="Inserisci la descrizione della campagna"
                onChange={onDescriptionChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 border-b border-gray-900/10 pb-12">
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">
            Immagini
          </h2>
          <p className="text-sm/6 text-gray-600">
            {allowMultipleImages
              ? "Carica una o più immagini per la campagna. Queste immagini verranno utilizzate come anteprima della campagna."
              : "Carica una immagine per la campagna. Questa immagine verrà utilizzata come anteprima della campagna."}
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="campaign-image"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Carica {allowMultipleImages ? "le immagini" : "l'immagine"} della campagna
            </label>
            <div className="mt-2">
              <Input
                id="campaign-image"
                name="campaign-image"
                type="file"
                accept="image/*"
                variant="bordered"
                radius="sm"
                multiple={allowMultipleImages}
                onChange={onImageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

