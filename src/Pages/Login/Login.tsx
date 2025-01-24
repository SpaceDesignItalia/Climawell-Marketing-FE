import { Button, Checkbox, Input } from "@heroui/react";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import StatusAlert from "../../Components/Layout/StatusAlert";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../../API/API";

interface UserData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AlertData {
  isOpen: boolean;
  onClose: () => void;
  alertTitle: string;
  alertDescription: string;
  alertColor: "green" | "red" | "yellow";
}

const INITIAL_USER_DATA: UserData = {
  email: "",
  password: "",
  rememberMe: false,
};

const INITIAL_ALERT_DATA: AlertData = {
  isOpen: false,
  onClose: () => {},
  alertTitle: "",
  alertDescription: "",
  alertColor: "red",
};

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [alertData, setAlertData] = useState<AlertData>(INITIAL_ALERT_DATA);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setUserData({ ...userData, rememberMe: !userData.rememberMe });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      console.log(userData);
      const response = await axios.post(
        "/Authentication/POST/Login",
        {
          LoginData: userData,
        },
        { baseURL: API_URL }
      );

      if (response.status == 200) {
        setAlertData({
          isOpen: true,
          onClose: () => setAlertData(INITIAL_ALERT_DATA),
          alertTitle: "Successo",
          alertDescription: "Accesso eseguito con successo",
          alertColor: "green",
        });
        window.location.href = "/";
      }
      console.log("Login successful:", response.data);
      // Gestione del successo, ad esempio reindirizzamento
    } catch (error) {
      if (isAxiosError(error))
        setAlertData({
          isOpen: true,
          onClose: () => setAlertData(INITIAL_ALERT_DATA),
          alertTitle: "Errore durante l'autenticazione",
          alertDescription: "Errore durante l'autenticazione",
          alertColor: "red",
        });
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      <StatusAlert AlertData={alertData} />
      <div className="flex h-screen flex-1 flex-col justify-center px-5 py-12 sm:px-6 lg:px-8 bg-[#F9FAFB] gap-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Climawell"
            src="https://static.wixstatic.com/media/fb5ac9_9096a8bcdb354787a339ef207dc014e9~mv2.png/v1/fill/w_242,h_242,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/PNGGGGGGGGGGGGGGGGGGGGGGG.png"
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Accedi al portale
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 border-2  rounded-lg sm:px-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <Input
                  label="Email"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="sm"
                  placeholder="Email"
                  autoComplete="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Input
                  label="Password"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="sm"
                  placeholder="Password"
                  autoComplete="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label="toggle password visibility"
                    >
                      {isVisible ? (
                        <VisibilityOffOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <VisibilityOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Checkbox
                    isSelected={userData.rememberMe}
                    onChange={handleCheckboxChange}
                    radius="sm"
                  >
                    Ricordami
                  </Checkbox>
                </div>

                <div className="text-sm/6">
                  <a
                    href="#"
                    className="font-semibold text-primary hover:text-primary-hover"
                  >
                    Password dimenticata?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  color="primary"
                  className="w-full"
                  radius="sm"
                  isLoading={isLoading}
                >
                  Accedi
                </Button>
              </div>
            </form>
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Non hai un account?{" "}
            <a
              href="#"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Contatta l'amministratore
            </a>
          </p>
        </div>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Powered By {""}
          <a
            href="https://www.spacedesign-italia.it"
            className="font-semibold text-red-500 hover:text-red-400"
          >
            🚀 Space Design Italia
          </a>
        </p>
      </div>
    </>
  );
}
