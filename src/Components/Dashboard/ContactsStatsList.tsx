import { useState, useEffect } from "react";
import axios from "axios";

export default function CantactsStatsList() {
  const [stats, setStats] = useState([
    { name: "Totale Clienti (Persone)", stat: "35.612" },
    { name: "Totale Clienti (Aziende)", stat: "8.945" },
  ]);

  useEffect(() => {
    axios
      .get("/Contacts/GET/GetAllPrivate", { params: { isPremium: false } })
      .then((response) => {
        setStats((prevStats) => {
          const newStats = [...prevStats];
          newStats[0].stat = response.data.length;
          return newStats;
        });
      });
    axios
      .get("/Contacts/GET/GetAllCompany", { params: { isPremium: false } })
      .then((response) => {
        setStats((prevStats) => {
          const newStats = [...prevStats];
          newStats[1].stat = response.data.length;
          return newStats;
        });
      });
  }, []);

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
