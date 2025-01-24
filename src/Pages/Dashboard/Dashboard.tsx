import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ContactsStatsList from "../../Components/Dashboard/ContactsStatsList";
import CampaignsStatsList from "../../Components/Dashboard/CampaignsStatsList";

const COLORS = {
  primary: "#0288d1",
  secondary: "#5c6bc0",
  success: "#22C55E",
  danger: "#EF4444",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#E5E7EB",
  background: "#F9FAFB",
};

// Componenti SVG per le frecce
const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// Componente personalizzato per il tooltip del grafico a torta
const PieCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white px-3 py-2 rounded-md shadow-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.payload.fill }}
          />
          <span className="text-sm font-medium text-gray-900">
            {data.name}: {data.value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Componente personalizzato per il tooltip dei grafici a barre e linee
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-md shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-800 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}:</span>
            <span className="text-sm font-medium text-gray-900">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Componente personalizzato per il label del grafico a torta
const PieCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#1F2937"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [contactsStats, setContactsStats] = useState({
    privateCount: 0,
    companyCount: 0,
    privateWithEmail: 0,
    privateWithWhatsapp: 0,
    companyWithEmail: 0,
    companyWithWhatsapp: 0,
  });

  const [campaignStats, setCampaignStats] = useState<{
    emailCount: number;
    whatsappCount: number;
    campaignsOverTime: { month: string; count: number }[];
    newCampaignsThisMonth: number;
    campaignsLastMonth: number;
  }>({
    emailCount: 0,
    whatsappCount: 0,
    campaignsOverTime: [],
    newCampaignsThisMonth: 0,
    campaignsLastMonth: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [privateRes, companyRes, emailRes, whatsappRes] =
          await Promise.all([
            axios.get("/Contacts/GET/GetAllPrivate", {
              params: { isPremium: false },
            }),
            axios.get("/Contacts/GET/GetAllCompany", {
              params: { isPremium: false },
            }),
            axios.get("/Campaigns/GET/GetAllEmailCampaigns"),
            axios.get("/Campaigns/GET/GetAllWhatsappCampaigns"),
          ]);

        // Process contacts data
        const privateContacts = privateRes.data;
        const companyContacts = companyRes.data;

        setContactsStats({
          privateCount: privateContacts.length,
          companyCount: companyContacts.length,
          privateWithEmail: privateContacts.filter((c: any) => c.CustomerEmail)
            .length,
          privateWithWhatsapp: privateContacts.filter(
            (c: any) => c.CustomerPhone
          ).length,
          companyWithEmail: companyContacts.filter((c: any) => c.CompanyEmail)
            .length,
          companyWithWhatsapp: companyContacts.filter(
            (c: any) => c.CompanyPhone
          ).length,
        });

        // Process campaigns data
        const emailCampaigns = emailRes.data;
        const whatsappCampaigns = whatsappRes.data;
        const combinedCampaigns = [...emailCampaigns, ...whatsappCampaigns];

        const campaignsByMonth = combinedCampaigns.reduce<
          Record<string, number>
        >((acc, campaign) => {
          const date = new Date(campaign.Date);
          const month = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const campaignsOverTime = Object.entries(campaignsByMonth)
          .map(([month, count]) => ({ month, count }))
          .sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
          );

        const currentMonth = new Date().getMonth() + 1;
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        const currentMonthCount = combinedCampaigns.filter(
          (campaign) => new Date(campaign.Date).getMonth() + 1 === currentMonth
        ).length;

        const lastMonthCount = combinedCampaigns.filter(
          (campaign) => new Date(campaign.Date).getMonth() + 1 === lastMonth
        ).length;

        setCampaignStats({
          emailCount: emailCampaigns.length,
          whatsappCount: whatsappCampaigns.length,
          campaignsOverTime,
          newCampaignsThisMonth: currentMonthCount,
          campaignsLastMonth: lastMonthCount,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const contactPieData = [
    {
      name: "Clienti Privati",
      value: contactsStats.privateCount,
      fill: COLORS.primary,
    },
    {
      name: "Aziende",
      value: contactsStats.companyCount,
      fill: COLORS.secondary,
    },
  ];

  const contactBarData = [
    {
      name: "Email",
      Privati: contactsStats.privateWithEmail,
      Aziende: contactsStats.companyWithEmail,
    },
    {
      name: "Whatsapp",
      Privati: contactsStats.privateWithWhatsapp,
      Aziende: contactsStats.companyWithWhatsapp,
    },
  ];

  const campaignsDifference =
    campaignStats.newCampaignsThisMonth - campaignStats.campaignsLastMonth;

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-[300px] bg-gray-100 rounded-lg w-full" />
    </div>
  );

  return (
    <main className="lg:ml-72 min-h-screen bg-white">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px]">
        <div className="space-y-6">
          <ContactsStatsList />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">
                  Distribuzione Clienti
                </h2>
              </div>
              <div className="p-4">
                {loading ? (
                  <LoadingSkeleton />
                ) : contactPieData[0].value > 0 ||
                  contactPieData[1].value > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={contactPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        label={PieCustomLabel}
                        labelLine={false}
                      >
                        {contactPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieCustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span className="text-sm text-gray-600">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-gray-500">Nessun dato disponibile</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">
                  Clienti con Email e Whatsapp
                </h2>
              </div>
              <div className="p-4">
                {loading ? (
                  <LoadingSkeleton />
                ) : contactPieData[0].value > 0 ||
                  contactPieData[1].value > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={contactBarData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fill: COLORS.text }}
                        axisLine={{ stroke: COLORS.border }}
                        tickLine={{ stroke: COLORS.border }}
                      />
                      <YAxis
                        tick={{ fill: COLORS.text }}
                        axisLine={{ stroke: COLORS.border }}
                        tickLine={{ stroke: COLORS.border }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        formatter={(value) => (
                          <span className="text-sm text-gray-600">{value}</span>
                        )}
                      />
                      <Bar
                        dataKey="Privati"
                        fill={COLORS.primary}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar
                        dataKey="Aziende"
                        fill={COLORS.secondary}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-gray-500">Nessun dato disponibile</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-6">
          <CampaignsStatsList />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">
                  Andamento Campagne
                </h2>
              </div>
              <div className="p-4">
                {loading ? (
                  <LoadingSkeleton />
                ) : campaignStats.campaignsOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={campaignStats.campaignsOverTime}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="month"
                        tick={{ fill: COLORS.text }}
                        axisLine={{ stroke: COLORS.border }}
                        tickLine={{ stroke: COLORS.border }}
                      />
                      <YAxis
                        tick={{ fill: COLORS.text }}
                        axisLine={{ stroke: COLORS.border }}
                        tickLine={{ stroke: COLORS.border }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Campagne"
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        dot={{
                          fill: COLORS.primary,
                          strokeWidth: 2,
                          r: 4,
                          stroke: "#fff",
                        }}
                        activeDot={{
                          r: 6,
                          fill: COLORS.secondary,
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-gray-500">Nessun dato disponibile</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">
                  Campagne rispetto al mese scorso
                </h2>
              </div>
              <div className="p-4">
                {loading ? (
                  <LoadingSkeleton />
                ) : campaignStats.campaignsOverTime.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Variazione mensile
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {campaignsDifference > 0 ? (
                            <span className="text-green-500">
                              <ArrowUpIcon />
                            </span>
                          ) : (
                            <span className="text-red-500">
                              <ArrowDownIcon />
                            </span>
                          )}
                          <span
                            className={`text-2xl font-bold ${
                              campaignsDifference > 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {Math.abs(campaignsDifference)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Questo mese
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">
                          {campaignStats.newCampaignsThisMonth}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Mese scorso
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">
                          {campaignStats.campaignsLastMonth}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-gray-500">Nessun dato disponibile</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
