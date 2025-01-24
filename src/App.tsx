import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { API_URL } from "./API/API";

import Loader from "./Components/Layout/Loader";
import Sidebar from "./Components/Layout/Sidebar";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Campaigns from "./Pages/Campaigns/Campaigns";
import AddCampaign from "./Pages/Campaigns/AddCampaign";
import Contacts from "./Pages/Contacts/Contacts";
import AddContact from "./Pages/Contacts/AddContact";
import RemovePrivateContact from "./Pages/Contacts/RemovePrivateContact";
import RemoveCompanyContact from "./Pages/Contacts/RemoveCompanyContact";
import Error404 from "./Pages/Errors/Error404";

const App: React.FC = () => {
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/Authentication/GET/CheckSession", {
          withCredentials: true,
        });

        if (res.status === 200 && res.data) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error("Errore durante il controllo della sessione:", error);
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {isAuth && <Sidebar />}
      <Routes>
        {!isAuth && (
          <>
            <Route element={<Login />} path="/login" />{" "}
            <Route
              element={<RemovePrivateContact />}
              path="/remove-private/:CampaignToken"
            />
            <Route
              element={<RemoveCompanyContact />}
              path="/remove-company/:CampaignToken"
            />
          </>
        )}

        <Route
          path="/*"
          element={
            isAuth ? <ProtectedRoutes /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </>
  );
};

const ProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route element={<Dashboard />} path="/" />
        <Route element={<Campaigns />} path="/campaigns" />
        <Route element={<AddCampaign />} path="/campaigns/add-new-campaign" />
        <Route element={<Contacts />} path="/contacts" />
        <Route element={<AddContact />} path="/contacts/add-new-contact" />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
};

export default App;
