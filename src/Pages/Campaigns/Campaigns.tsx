import { Tabs, Tab } from "@heroui/react";
import StatsList from "../../Components/Campaigns/Other/StatsList";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import EmailCampaignTable from "../../Components/Campaigns/Table/EmailCampaignsTable";
import WhatsappCampaignTable from "../../Components/Campaigns/Table/WhatsappCampaignsTable";

export default function Contacts() {
  return (
    <main className="lg:ml-72 py-10">
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
        <StatsList />
        <div>
          <Tabs variant="underlined">
            <Tab
              key="campagne"
              title={
                <div className="flex flex-row gap-2 items-center">
                  <EmailOutlinedIcon /> Email
                </div>
              }
            >
              <EmailCampaignTable />
            </Tab>
            <Tab
              key="aziende"
              title={
                <div className="flex flex-row gap-2 items-center">
                  <ChatBubbleOutlineOutlinedIcon /> Whatsapp
                </div>
              }
            >
              <WhatsappCampaignTable />
            </Tab>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
