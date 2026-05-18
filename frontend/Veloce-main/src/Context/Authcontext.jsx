import { createContext, useEffect, useState } from "react";
import { api } from "../service/api";
import toast from "react-hot-toast";
import ConfirmModal from "../admin/pages/modal";
import { useNavigate } from "react-router-dom";

export const Authcontext = createContext();

function Authprovider({ children }) {
  const navigate = useNavigate();

  const [user, setuser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState({
    show: false,
    onConfirm: null,
    title: "",
    message: "",
    confirmText: "Confirm",
    type: "default",
  });

  // ------------------ Modal Control ------------------
  const openModal = (config) => setModalConfig({ ...config, show: true });
  const closeModal = () => setModalConfig((prev) => ({ ...prev, show: false }));

  // -------------------- Fetch latest user data --------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/me/");
        setuser(data);
      } catch (err) {
        if (err.response?.status !== 401) {
        console.error(err);
      }
        setuser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);




  // -------------------- Login & Merge Orders --------------------
  const loginUser = async () => {
    try {
      const { data } = await api.get("/me/");
      setuser(data);
      return data;
    } catch (err) {
      console.error("Login user fetch failed");
    }
  };
  // -------------------- Logout --------------------

  const handleLogoutClick = () => {
    openModal({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      confirmText: "Logout",
      type: "logout",
      onConfirm: confirmLogout,
    });
  };

  const confirmLogout = async () => {
    try {
      await api.post("/logout/");
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("user");

    setuser(null);
    setAdmin(null);

    closeModal();
    navigate("/login");
  };

  // -------------------- Context Return --------------------
  return (
    <Authcontext.Provider
      value={{
        loading,
        user,
        admin,
        loginUser,
        logout: handleLogoutClick,
        setuser,
      }}
    >
      {children}

      <ConfirmModal
        show={modalConfig.show}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
      />
    </Authcontext.Provider>
  );
}

export default Authprovider;
