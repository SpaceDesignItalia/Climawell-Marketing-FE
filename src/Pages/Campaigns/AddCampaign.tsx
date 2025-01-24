import AddCampaignModel from "../../Components/Campaigns/Other/AddCampaignModel";

export default function AddCampaign() {
  return (
    <main className="lg:ml-72 py-10">
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Crea nuova campagna</h1>
        <AddCampaignModel />
      </div>
    </main>
  );
}
