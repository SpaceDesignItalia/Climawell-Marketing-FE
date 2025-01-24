import axios from "axios";
import { useEffect, useState } from "react";

export default function StatsList() {
  const [stats, setStats] = useState([
    { name: "Totale Campagne (E-Mail)", stat: "1.786" },
    { name: "Totale Campagne (Whatsapp)", stat: "2.109" },
    { name: "Nuove Campagne Questo Mese", stat: "126" },
  ]);

  useEffect(() => {
    axios.get("/Campaigns/GET/GetAllEmailCampaigns").then((response) => {
      setStats((prevStats) => {
        const newStats = [...prevStats];
        newStats[0].stat = response.data.length;
        return newStats;
      });
    });
    axios.get("/Campaigns/GET/GetAllWhatsappCampaigns").then((response) => {
      setStats((prevStats) => {
        const newStats = [...prevStats];
        newStats[1].stat = response.data.length;
        return newStats;
      });
    });
    axios.get("/Campaigns/GET/GetNewCampaignsThisMonth").then((response) => {
      setStats((prevStats) => {
        const newStats = [...prevStats];
        newStats[2].stat = response.data.campaigns;
        return newStats;
      });
    });
  }, []);

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden border-2 rounded-lg bg-white px-4 py-5 sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
