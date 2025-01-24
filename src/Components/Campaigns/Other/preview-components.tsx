"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

// Types
interface PreviewMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData: {
    title: string;
    object: string;
    description: string;
    image?: string;
  };
}

interface PreviewWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData: {
    title: string;
    description: string;
    images?: FileList;
  };
}

// Utility functions
function sanitizeHtml(html: string): string {
  if (typeof document !== "undefined") {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
  return html.replace(/(<([^>]+)>)/gi, "");
}

function EmailTemplate({
  campaignData,
}: {
  campaignData: PreviewMailModalProps["campaignData"];
}) {
  return `
    <!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="it">
      <head>
        <title>Climawell</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            text-size-adjust: none;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
          }
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
          }
          table {
            border-collapse: collapse;
            table-layout: fixed;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background-color: #ffffff;
            padding: 40px 0;
            text-align: center;
            border-bottom: 1px solid rgba(0,0,0,0.05);
          }
          .content {
            padding: 60px 40px;
            background-color: #ffffff;
          }
          .footer {
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 40px;
            text-align: center;
          }
          .title {
            font-family: "Georgia", serif;
            font-size: 32px;
            line-height: 1.3;
            font-weight: normal;
            color: #1a1a1a;
            margin: 0 0 30px;
            letter-spacing: -0.3px;
          }
          .subtitle {
            font-family: Arial, sans-serif;
            font-size: 18px;
            color: #666666;
            margin: 0 0 40px;
            line-height: 1.6;
            font-weight: 300;
          }
          .text {
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.8;
            color: #333333;
            margin: 0 0 25px;
          }
          .button {
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 18px 36px;
            text-decoration: none;
            display: inline-block;
            font-family: Arial, sans-serif;
            font-weight: 500;
            font-size: 16px;
            margin-top: 30px;
            border-radius: 3px;
          }
          .divider {
            height: 1px;
            background-color: rgba(0,0,0,0.05);
            margin: 50px 0;
          }
          .highlight-box {
            background-color: #f8f9fa;
            border-left: 4px solid #1a1a1a;
            padding: 25px;
            margin: 30px 0;
          }
          .signature {
            font-family: "Georgia", serif;
            font-style: italic;
            color: #666666;
            margin-top: 40px;
          }
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .content { padding: 40px 20px !important; }
            .title { font-size: 26px !important; }
            .subtitle { font-size: 16px !important; }
          }
        </style>
      </head>
      <body>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 40px 20px">
              <table class="container" role="presentation" width="600" cellpadding="0" cellspacing="0">
                <!-- Header -->
                <tr>
                  <td class="header">
                    <img src="https://static.wixstatic.com/media/fb5ac9_9096a8bcdb354787a339ef207dc014e9~mv2.png/v1/fill/w_240,h_157,al_c,lg_1,q_85,enc_auto/PNGGGGGGGGGGGGGGGGGGGGGGG.png" 
                         alt="Climawell Logo" width="180" style="display: block; margin: 0 auto" />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td class="content">
                    <h1 class="title">Gentile Cliente,</h1>

                  

                    <div class="highlight-box">
                      <div class="text" style="margin: 0">
                        ${
                          campaignData.description ||
                          "Nessuna descrizione specificata"
                        }
                      </div>
                    </div>

                    ${
                      campaignData.image
                        ? `
                      <div style="text-align: center; margin: 40px 0">
                        <img src="${campaignData.image}" 
                             alt="Campaign Image" 
                             style="max-width: 100%; height: auto; border-radius: 4px;" />
                      </div>
                    `
                        : ""
                    }

                    <p class="signature">
                      Con i migliori auguri di successo,<br />
                      Il Team Climawell
                    </p>

                    <div class="divider"></div>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0">
                          <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; margin: 0 0 20px;">
                            Gestisci le tue preferenze di comunicazione:
                          </p>
                          <a href="#" 
                             style="color: #1a1a1a; text-decoration: none; font-family: Arial, sans-serif; font-size: 14px; border-bottom: 1px solid #1a1a1a; padding-bottom: 2px;">
                            Impostazioni Newsletter
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td class="footer">
                    <p style="margin: 0 0 20px; font-family: Georgia, serif; font-size: 18px;">
                      Climawell S.R.L.
                    </p>
                    <a href="https://www.climawell.net/" 
                       style="color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 2px;">
                      www.climawell.net
                    </a>
                    <p style="margin: 30px 0 0; font-size: 12px; color: rgba(255,255,255,0.7); font-family: Arial, sans-serif; line-height: 1.6;">
                      © ${new Date().getFullYear()} Climawell S.R.L. Tutti i diritti riservati.<br />
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function PreviewMailModal({
  isOpen,
  onClose,
  campaignData,
}: PreviewMailModalProps) {
  const emailContent = EmailTemplate({ campaignData });

  return (
    <Modal
      size="3xl"
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[95vh] m-2",
        body: "p-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Anteprima Email
            </ModalHeader>
            <ModalBody>
              <iframe
                srcDoc={emailContent}
                className="w-full h-[85vh] rounded-lg bg-gray-50"
                title="Email Preview"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Chiudi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function PreviewWhatsAppModal({
  isOpen,
  onClose,
  campaignData,
}: PreviewWhatsAppModalProps) {
  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[95vh] m-2",
        body: "p-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Anteprima WhatsApp
            </ModalHeader>
            <ModalBody>
              {/* Main container with WhatsApp background */}
              <div className="bg-[#efeae2] min-h-[60vh] rounded-lg overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-[#f0f2f5] px-4 py-2 flex items-center gap-3 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center">
                    <img
                      src="https://static.wixstatic.com/media/fb5ac9_9096a8bcdb354787a339ef207dc014e9~mv2.png/v1/fill/w_240,h_157,al_c,lg_1,q_85,enc_auto/PNGGGGGGGGGGGGGGGGGGGGGGG.png"
                      alt="Profile"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-[#111b21]">
                      Climawell
                    </div>
                    <div className="text-xs text-[#667781]">online</div>
                  </div>
                </div>

                {/* Chat area with dashed pattern background */}
                <div
                  className="p-4 min-h-[calc(60vh-64px)]"
                  style={{
                    backgroundImage: `
                      linear-gradient(to bottom, rgba(229,221,213,0.95), rgba(229,221,213,0.95)),
                      url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=")
                    `,
                  }}
                >
                  {/* Message bubble */}
                  <div className="bg-white rounded-lg shadow-md relative max-w-[80%] ml-auto">
                    {/* Message arrow */}
                    <div
                      className="absolute -right-2 top-0 w-4 h-4 bg-white"
                      style={{
                        clipPath: "polygon(0 0, 100% 100%, 100% 0)",
                      }}
                    />

                    {/* Message content */}
                    <div className="p-3 space-y-2">
                      {/* Image */}
                      {campaignData.images &&
                        campaignData.images.length > 0 && (
                          <div className="rounded-lg overflow-hidden mb-2">
                            <img
                              src={URL.createObjectURL(campaignData.images[0])}
                              alt="Campaign"
                              className="w-full h-auto"
                            />
                          </div>
                        )}

                      {/* Title */}
                      <div className="font-semibold text-[#111b21] text-base">
                        {campaignData.title || "Nome Offerta"}
                      </div>

                      {/* Greeting */}
                      <div className="text-[#111b21] text-[14.2px]">
                        Ciao Nome utente,
                      </div>

                      {/* Description */}
                      <div className="text-[#111b21] whitespace-pre-wrap text-[14.2px] leading-[19px]">
                        {sanitizeHtml(campaignData.description) ||
                          "Lorem Ipsum"}
                      </div>

                      {/* Marketing Footer */}
                      <div className="mt-4 text-[13px] text-[#667781] border-t border-[#e9edef] pt-2">
                        <em>
                          Se non desideri ricevere più comunicazioni di
                          marketing scrivi alla mail:
                          <br />
                          marketing@climawell.net
                        </em>
                      </div>

                      {/* Company Name */}
                      <div className="text-[13px] text-[#667781]">
                        Climawell S.R.L.
                      </div>

                      {/* Message Info */}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[11px] text-[#667781]">
                          {new Date().toLocaleTimeString("it-IT", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {/* Double check mark */}
                        <svg
                          className="w-[16px] h-[16px]"
                          viewBox="0 0 16 15"
                          fill="#53bdeb"
                        >
                          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                        </svg>
                      </div>
                    </div>

                    {/* Website Link */}
                    <a
                      href="#"
                      className="block bg-[#f0f2f5] text-[#53bdeb] hover:bg-[#e9edef] transition-colors py-3 px-4 text-center border-t border-[#e9edef] text-[14.2px] rounded-bl-lg rounded-br-lg"
                      onClick={(e) => e.preventDefault()}
                    >
                      Visita sito
                    </a>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Chiudi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
