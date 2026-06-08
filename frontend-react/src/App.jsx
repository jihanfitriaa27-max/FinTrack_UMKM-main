import { useState, useEffect, useRef, useCallback } from "react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";


import {
  authService,
  transactionService,
  productService,
  analyticsService,
  aiService,
  settingsService
} from "./services/api";

// ─── DESIGN TOKENS (SESUAI FIGMA) ──────────────────────────────────
const DS = {
  primary: "#A78BFA",
  secondary: "#60A5FA",
  tertiary: "#F5F3FF",

  neutral: "#64748B",

  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",

  bgLight: "#F8FAFC",
  bgCard: "#FFFFFF",
  bgSidebar: "#FFFFFF",

  textMain: "#1E293B",
  textSecond: "#64748B",
  textMuted: "#94A3B8",

  borderLight: "#E2E8F0",
  primaryDark: "#6D28D9",

  shadowSm: "0 1px 2px 0 rgba(0,0,0,.05)",
  shadowMd:
    "0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)",
  shadowLg:
    "0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)",
};

// ─── ICONS ────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor", className = "" }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    transactions: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M13 2H3v20h18V8z"/><polyline points="3 2 3 22 21 22 21 8 13 8 13 2"/></svg>,
    inventory: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
    ai: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    reports: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 20v2"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    chevronDown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  };
  return <span className={className}>{icons[name] || icons.dashboard}</span>;
};

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────
const rp = (n) =>
  "Rp " + Number(n || 0).toLocaleString("id-ID");

const fmtDate = (d) => {
  if (!d) return "-";

  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ----- Main APP -------------
export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token =
      localStorage.getItem("auth_token");

    if (!token) {
      setCurrentPage("login");
      setIsLoading(false);
      return;
    }

    try {
    const response = await authService.me();

    setUser(response.data.user);
    setCurrentPage("dashboard");
    } catch (error) {
      localStorage.removeItem("auth_token");
      setCurrentPage("login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("auth_token");
    setUser(null);
    setCurrentPage("login");
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user || currentPage === "login") {
    return (
      <LoginPage
        setCurrentPage={setCurrentPage}
        setUser={setUser}
      />
    );
  }

  return (
      <div
        style={{
          display: "flex",
          backgroundColor: DS.bgLight,
          minHeight: "100vh",
          alignItems: "stretch",
        }}
      >
      {sidebarOpen && (
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

          <main
            style={{
              flex: 1,
              padding: "24px",
            }}
          >
          {currentPage === "dashboard" && (
            <DashboardPage user={user} />
          )}

          {currentPage === "transactions" && (
            <TransactionsPage />
          )}

          {currentPage === "inventory" && (
            <InventoryPage />
          )}

          {currentPage === "ai" && (
            <AIPage />
          )}

          {currentPage === "reports" && (
            <ReportsPage />
          )}

          {currentPage === "settings" && (
            <SettingsPage
              user={user}
              setUser={setUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function LoginPage({ setCurrentPage, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response =
        await authService.login(
          email,
          password
        );

      localStorage.setItem(
        "auth_token",
        response.data.token
      );

      setUser(response.data.user);
      setCurrentPage("dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login gagal"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response =
        await authService.register(
          formData
        );

      localStorage.setItem(
        "auth_token",
        response.data.token
      );

      setUser(response.data.user);
      setCurrentPage("dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Register gagal"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)",
      padding: "24px",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "520px",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: "24px",
        padding: "48px",
        boxShadow:
          "0 20px 40px rgba(124,58,237,0.15)",
        border: `1px solid ${DS.borderLight}`,
      }}
    >
      {/* Logo */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            background:
              "linear-gradient(135deg,#A78BFA,#7C3AED)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 20px",
            overflow: "hidden",
          }}
        >
          <img
            src="/Logo.jpg"
            alt="FinTrack Logo"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "38px",
            fontWeight: "700",
            color: DS.textMain,
          }}
        >
          FinTrack UMKM
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: DS.textSecond,
            fontSize: "15px",
          }}
        >
          Kelola keuangan bisnis Anda lebih mudah dan cerdas.
        </p>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "20px",
            background: "#FEF2F2",
            color: "#DC2626",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {!isRegister ? (
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: DS.textMain,
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="nama@email.com"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: `1px solid ${DS.borderLight}`,
                backgroundColor: DS.bgLight,
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: DS.textMain,
              }}
            >
              Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: `1px solid ${DS.borderLight}`,
                  backgroundColor: DS.bgLight,
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <Icon
                  name="eye"
                  color={DS.textMuted}
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background:
                "linear-gradient(135deg,#A78BFA,#7C3AED)",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow:
                "0 10px 20px rgba(124,58,237,0.25)",
            }}
          >
            {isLoading
              ? "Logging in..."
              : "Login"}
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
            }}
          >
            <span
              style={{
                color: DS.textSecond,
              }}
            >
              Belum punya akun?
            </span>

            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: DS.primary,
                fontWeight: "600",
                cursor: "pointer",
                marginLeft: "6px",
              }}
            >
              Register
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Nama
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: `1px solid ${DS.borderLight}`,
                backgroundColor: DS.bgLight,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: `1px solid ${DS.borderLight}`,
                backgroundColor: DS.bgLight,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: `1px solid ${DS.borderLight}`,
                backgroundColor: DS.bgLight,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Konfirmasi Password
            </label>

            <input
              type="password"
              value={
                formData.password_confirmation
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password_confirmation:
                    e.target.value,
                })
              }
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: `1px solid ${DS.borderLight}`,
                backgroundColor: DS.bgLight,
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background:
                "linear-gradient(135deg,#A78BFA,#7C3AED)",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow:
                "0 10px 20px rgba(124,58,237,0.25)",
            }}
          >
            {isLoading
              ? "Registering..."
              : "Register"}
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
            }}
          >
            <span
              style={{
                color: DS.textSecond,
              }}
            >
              Sudah punya akun?
            </span>

            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: DS.primary,
                fontWeight: "600",
                cursor: "pointer",
                marginLeft: "6px",
              }}
            >
              Login
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);

}


// ─── SIDEBAR COMPONENT ─────────────────────────────────────────────
function Sidebar({ currentPage, setCurrentPage, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "transactions", label: "Transaksi", icon: "transactions" },
    { id: "inventory", label: "Stok Produk", icon: "inventory" },
    { id: "ai", label: "AI Insights", icon: "ai" },
    { id: "reports", label: "Laporan Harian", icon: "reports" },
    { id: "settings", label: "Pengaturan", icon: "settings" },
  ];

  return (
  <div
    style={{
      width: "240px",
      minWidth: "240px",
      backgroundColor: DS.bgSidebar,
      borderRight: `1px solid ${DS.borderLight}`,
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      position: "sticky",
      top: 0,
      alignSelf: "flex-start",
    }}>
    {/* Logo */}
    <div style={{ marginBottom: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src="/Logo.jpg"
          alt="FinTrack Logo"
          style={{
            width: "36px",
            height: "36px",
            objectFit: "contain",
          }}
        />

        <span
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: DS.primary,
          }}
        >
          FinTrack UMKM
        </span>
      </div>
    </div>

      {/* Menu Items */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              width: "100%",
              padding: "12px 16px",
              marginBottom: "8px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor: currentPage === item.id ? DS.primary : "transparent",
              color: currentPage === item.id ? "#FFFFFF" : DS.textSecond,
              transition: "all 0.2s",
            }}
          >
            <Icon name={item.icon} size={20} color={currentPage === item.id ? "#FFFFFF" : DS.textSecond} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "14px",
          fontWeight: "500",
          backgroundColor: "transparent",
          color: DS.danger,
          transition: "all 0.2s",
        }}
      >
        <Icon name="logout" size={20} color={DS.danger} />
        Keluar
      </button>
    </div>
  );
}

// ─── HEADER COMPONENT FINAL ─────────────────────────
function Header({ sidebarOpen, setSidebarOpen, user }) {
  return (
    <header
      style={{
        backgroundColor: DS.bgCard,
        borderBottom: `1px solid ${DS.borderLight}`,
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flex: 1,
        }}
      >
        {/* Sidebar Toggle (Logic FE1) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "8px",
            color: DS.textSecond,
          }}
        >
          <Icon name="menu" size={22} color={DS.textSecond} />
        </button>

        {/* Search Bar (UI FE2) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#F1F5F9",
            padding: "10px 14px",
            borderRadius: "16px",
            maxWidth: "420px",
            width: "100%",
          }}
        >
          <Icon
            name="search"
            size={18}
            color={DS.textMuted}
          />

          <input
            type="text"
            placeholder="Cari transaksi atau laporan..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "14px",
              color: DS.textMain,
            }}
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* Notification */}
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: DS.textSecond,
          }}
        >
          <Icon
            name="bell"
            size={20}
            color={DS.textSecond}
          />
        </button>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "28px",
            backgroundColor: DS.borderLight,
          }}
        />

        {/* Upgrade */}
        <button
          style={{
            backgroundColor: "#EDE9FE",
            color: "#6D28D9",
            border: "none",
            borderRadius: "20px",
            padding: "10px 18px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
         Hai, Apa Kabar?
        </button>

        {/* User Info (Logic FE1) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              textAlign: "right",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: "600",
                color: DS.textMain,
              }}
            >
              {user?.name || "User"}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: DS.textMuted,
              }}
            >
              {user?.email || "-"}
            </p>
          </div>

          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#A78BFA,#7C3AED)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "15px",
              boxShadow:
                "0 4px 12px rgba(124,58,237,0.25)",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── DASHBOARD PAGE ────────────────────────────────────────────────
function DashboardPage({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await analyticsService.getDashboard();

      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }


  const kpiData = [
    {
      title: "PENJUALAN",
      value: rp(dashboardData?.total_revenue || 0),
      icon: "💳",
      color: DS.success,
    },
    {
      title: "PENGELUARAN",
      value: rp(dashboardData?.total_expenses || 0),
      icon: "🛒",
      color: DS.warning,
    },
    {
      title: "LABA",
      value: rp(dashboardData?.profit || 0),
      icon: "📈",
      color: DS.primary,
    },
    {
      title: "PRODUK",
      value: dashboardData?.product_count || 0,
      icon: "📦",
      color: DS.secondary,
    },
  ];

const hariIndonesia = [
  "Min",
  "Sen",
  "Sel",
  "Rab",
  "Kam",
  "Jum",
  "Sab",
];

const chartData = (() => {
  const rawData = dashboardData?.revenue_chart || [];

  const mapData = {};

  rawData.forEach((item) => {
    const dateKey = item.date.split("T")[0];

    mapData[dateKey] = {
      revenue: Number(item.revenue || 0),
      expenses: Number(item.expense || 0),
    };
  });

  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    const key = date.toISOString().split("T")[0];

    result.push({
      day: hariIndonesia[date.getDay()],
      fullDate: key,
      revenue: mapData[key]?.revenue || 0,
      expenses: mapData[key]?.expenses || 0,
    });
  }

  return result;
})();

  // const chartData =
  // dashboardData?.revenue_chart?.map((item) => ({
  //   name: item.date ?? "-",
  //   amount: Number(item.amount) || 0,
  // })) || [];

  const activities =
    dashboardData?.recent_transactions?.map((tx) => ({
      id: tx.id,
      title: tx.category,
      date: tx.date,
      note: tx.note,
      amount: tx.amount,
      type: tx.type,
    })) || [];

  const aktivitas =
    dashboardData?.recent_transactions?.map((tx) => ({
      id: tx.id,
      title: tx.category,
      date: tx.date,
      note: tx.note,
      amount: tx.amount,
      type: tx.type,
    })) || [];

    const latestActivities =
    dashboardData?.recent_transactions || [];

  console.log(
    dashboardData?.revenue_chart
  );
  console.log("dashboardData =", dashboardData);
console.log("recent_transactions =", dashboardData?.recent_transactions);
console.log("aktivitas =", aktivitas);
console.log("latestActivities =", latestActivities);
  return (
    <div style={{ paddingBottom: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: DS.textMain,
            marginBottom: "8px",
          }}
        >
          Selamat Datang, {user?.name}
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: DS.textSecond,
          }}
        >
          Ringkasan bisnis dan performa keuangan Anda hari ini.
        </p>
      </div>
      

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {kpiData.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: DS.bgCard,
              borderRadius: "12px",
              padding: "20px",
              border: `1px solid ${DS.borderLight}`,
            }}
          >
            <div
              style={{
                fontSize: "26px",
                marginBottom: "12px",
              }}
            >
              {item.icon}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: DS.textMuted,
                marginBottom: "6px",
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: item.color,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
        }}
      >
        {/* Chart */}
<div
  style={{
    backgroundColor: DS.bgCard,
    borderRadius: "20px",
    padding: "24px",
    border: `1px solid ${DS.borderLight}`,
  }}
>
  {/* Header */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    }}
  >
    <div>
      <h3
        style={{
          margin: 0,
          fontSize: "22px",
          fontWeight: "700",
          color: DS.textMain,
        }}
      >
        Tren Penjualan vs Pembelian
      </h3>

      <p
        style={{
          marginTop: "4px",
          fontSize: "13px",
          color: DS.textMuted,
        }}
      >
        Statistik transaksi harian
      </p>
    </div>

    <div
      style={{
        padding: "8px 14px",
        borderRadius: "12px",
        backgroundColor: "#F3F4F6",
        fontSize: "13px",
        color: "#6B7280",
        fontWeight: 500,
      }}
    >
      {chartData.length} Hari
    </div>
  </div>

  {/* Chart */}
  <ResponsiveContainer width="100%" height={320}>
    <BarChart
      data={chartData}
      barGap={6}
      margin={{
        top: 10,
        right: 10,
        left: 10,
        bottom: 0,
      }}
    >
      <XAxis
        dataKey="day"
        axisLine={false}
        tickLine={false}
        tick={{
          fill: "#6B7280",
          fontSize: 12,
        }}
      />

      <YAxis
        hide
        domain={[0, "dataMax + 100000"]}
      />

      <Tooltip
        labelFormatter={(label, payload) => {
          if (payload?.length) {
            return `${label} (${payload[0].payload.fullDate})`;
          }

          return label;
        }}
        formatter={(value) => rp(Number(value))}
        contentStyle={{
          borderRadius: "12px",
          border: "none",
          boxShadow: "0 10px 25px rgba(0,0,0,.12)",
        }}
      />

      <Legend
        iconType="circle"
        wrapperStyle={{
          paddingTop: "20px",
          fontSize: "13px",
        }}
      />

      <Bar
        dataKey="expenses"
        name="Pembelian"
        fill="#A78BFA"
        radius={[8, 8, 0, 0]}
        maxBarSize={28}
      />

      <Bar
        dataKey="revenue"
        name="Penjualan"
        fill="#6D28D9"
        radius={[8, 8, 0, 0]}
        maxBarSize={28}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

        {/* Activity */}
{/* Aktivitas Terbaru */}
<div
  style={{
    background: "#fff",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    border: "1px solid #F1F5F9",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    }}
  >
    <h3
      style={{
        margin: 0,
        fontSize: "22px",
        fontWeight: 700,
        color: DS.textMain,
      }}
    >
      Aktivitas Terbaru
    </h3>
  </div>

  {latestActivities.length === 0 ? (
    <div
      style={{
        padding: "20px 0",
        textAlign: "center",
        color: "#94A3B8",
      }}
    >
      Belum ada transaksi
    </div>
  ) : (
    latestActivities.map((item) => (
      <div
        key={item.id}
        style={{
          padding: "14px 0",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "4px",
                color: DS.textMain,
              }}
            >
              {item.category}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#64748B",
                marginBottom: "4px",
              }}
            >
              {item.note || "Tidak ada catatan"}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#94A3B8",
              }}
            >
              {fmtDate(item.date)}
            </div>
          </div>

          <div
            style={{
              fontWeight: 700,
              whiteSpace: "nowrap",
              color:
                item.type === "penjualan"
                  ? "#10B981"
                  : "#EF4444",
            }}
          >
            {item.type === "penjualan"
              ? "+"
              : "-"}
            {rp(item.amount)}
          </div>
        </div>
      </div>
    ))
  )}
</div>
      </div>
    </div>
  );
}

//-------TransactionsPage-------//
const TX_CATEGORIES = {
  penjualan: [
    "Penjualan Produk",
    "Jasa / Layanan",
    "Komisi",
    "Lainnya",
  ],

  pengeluaran: [
    "Utilitas (Listrik, Air, dll)",
    "Transportasi & Logistik",
    "Marketing & Promosi",
    "Gaji Karyawan",
    "Sewa Tempat",
    "Lainnya",
  ],
};




function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    type: "pengeluaran",
    amount: "",
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const [prediction, setPrediction] =
  useState(null);

  const fetchTransactions = async () => {
    try {
      const [txResponse, aiResponse] =
        await Promise.all([
          transactionService.getAll(),
          aiService.predictSales("month"),
        ]);

      setTransactions(
        txResponse?.data?.data?.data ||
        txResponse?.data?.data ||
        []
      );

      setPrediction(
        aiResponse?.data?.data || null
      );
    } catch (err) {
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await transactionService.create({
      ...formData,
      amount: parseInt(formData.amount, 10),
    });


      setFormData({
        type: "pengeluaran",
        amount: "",
        category: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
      });

      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan transaksi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus transaksi?")) return;

    try {
      await transactionService.delete(id);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPengeluaran = transactions
    .filter((t) => t.type !== "penjualan")
    .reduce((a, b) => a + Number(b.amount || 0), 0);

  const totalPenjualan = transactions
    .filter((t) => t.type === "penjualan")
    .reduce((a, b) => a + Number(b.amount || 0), 0);

  const targetBudgetHarian =
    (prediction?.predicted_sales || 0) / 30;

  const budgetTerpakaiPercent =
    targetBudgetHarian > 0
      ? Math.min(
          100,
          (totalPengeluaran /
            targetBudgetHarian) *
            100
        )
      : 0;

  const sisaBudget =
    Math.max(
      0,
      targetBudgetHarian -
        totalPengeluaran
    );

  return (
    <div style={{ paddingBottom: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: DS.textMain,
            marginBottom: "8px",
          }}
        >
          Input Transaksi Harian
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: DS.textSecond,
          }}
        >
          Catat transaksi dan pengeluaran bisnis Anda.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: DS.bgCard,
          borderRadius: "12px",
          padding: "24px",
          border: `1px solid ${DS.borderLight}`,
          boxShadow: DS.shadowSm,
        }}
      >
        {/* JENIS TRANSAKSI */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Jenis Transaksi
          </label>

          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
                category: "",
              })
            }
            style={inputStyle}
          >
            <option value="penjualan">
              Penjualan
            </option>

            <option value="pengeluaran">
              Pengeluaran
            </option>
          </select>
        </div>

        {/* JUMLAH */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>
            Jumlah Transaksi
          </label>

          <input
            type="number"
            required
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
            style={inputStyle}
          />
        </div>

        {/* TANGGAL */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>
            Tanggal
          </label>

          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value,
              })
            }
            style={inputStyle}
          />
        </div>

        {/* KATEGORI */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>
            Kategori
          </label>

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
            style={inputStyle}
            required
          >
            <option value="">
              Pilih Kategori
            </option>

            {(TX_CATEGORIES[
              formData.type
            ] || []).map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* CATATAN */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Catatan
          </label>

          <textarea
            value={formData.note}
            onChange={(e) =>
              setFormData({
                ...formData,
                note: e.target.value,
              })
            }
            style={{
              ...inputStyle,
              minHeight: "100px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: DS.primary,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          💾 Simpan Transaksi
        </button>
      </form>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "24px",
            alignItems: "start",
          }}
        >
         {/* SIDEBAR SUMMARY */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          minWidth: "320px",
        }}
      >
        {/* RINGKASAN */}
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            border: "1px solid #F1F5F9",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              fontWeight: 700,
              fontSize: "24px",
            }}
          >
            Ringkasan Hari Ini
          </h3>

          {/* Pengeluaran */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#F8FAFC",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "14px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Total Pengeluaran
              </div>
            </div>

            <div
              style={{
                color: "#EF4444",
                fontWeight: 700,
              }}
            >
              {rp(totalPengeluaran)}
            </div>
          </div>

          {/* Penjualan */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#F8FAFC",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                Total Penjualan
              </div>
            </div>

            <div
              style={{
                color: "#2563EB",
                fontWeight: 700,
              }}
            >
              {rp(totalPenjualan)}
            </div>
          </div>

          {/* Target Budget */}
          <div
            style={{
              borderTop: "1px solid #E5E7EB",
              paddingTop: "16px",
            }}
          >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "12px",
              color: "#64748B",
            }}
          >
            <span>
              Target Budget Harian
            </span>

            <span
              style={{
                fontWeight: 700,
                color: "#7C3AED",
              }}
            >
              {rp(targetBudgetHarian)}
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#E2E8F0",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${budgetTerpakaiPercent}%`,
                height: "100%",
                background:
                  budgetTerpakaiPercent > 100
                    ? "#EF4444"
                    : "linear-gradient(90deg,#A78BFA,#7C3AED)",
                transition: "0.3s",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "8px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
            }}
          >
            <span
              style={{
                color: "#64748B",
              }}
            >
              Terpakai:
              {" "}
              {budgetTerpakaiPercent.toFixed(
                0
              )}
              %
            </span>

            <span
              style={{
                color: "#7C3AED",
                fontWeight: 700,
              }}
            >
              Sisa:
              {" "}
              {rp(sisaBudget)}
            </span>
          </div>
        </div>
        </div>

        {/* TIPS HEMAT */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#A78BFA,#7C3AED)",
            borderRadius: "18px",
            padding: "28px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "28px",
              marginBottom: "12px",
            }}
          >
            Tips Hemat
          </div>

          <div
            style={{
              fontSize: "15px",
              lineHeight: "28px",
              opacity: 0.95,
            }}
          >
            Evaluasi pembelian stok di akhir minggu
            untuk mendapatkan harga grosir terbaik.
          </div>
        </div>


      </div>
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          minWidth: "320px",
        }}
      >
                {/* TERAKHIR DICATAT */}
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            border: "1px solid #F1F5F9",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              Terakhir Dicatat
            </h3>

            <span
              style={{
                color: "#7C3AED",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
            </span>
          </div>

      {loading ? (
        <div
          style={{
            padding: "20px 0",
            textAlign: "center",
            color: "#64748B",
          }}
        >
          Loading...
        </div>
      ) : transactions.length === 0 ? (
        <div
          style={{
            padding: "20px 0",
            textAlign: "center",
            color: "#94A3B8",
          }}
        >
          Belum ada transaksi
        </div>
      ) : (
        transactions
          .slice()
          .slice(0, 5)
          .map((tx) => (
            <div
              key={tx.id}
              style={{
                padding: "14px 0",
                borderBottom:
                  "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    {tx.category}
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                      marginBottom: "4px",
                    }}
                  >
                    {tx.note || "Tidak ada catatan"}
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#94A3B8",
                    }}
                  >
                    {fmtDate(tx.date)}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    color:
                      tx.type === "penjualan"
                        ? "#10B981"
                        : "#EF4444",
                  }}
                >
                  {tx.type === "penjualan"
                    ? "+"
                    : "-"}
                  {rp(tx.amount)}
                </div>
              </div>
            </div>
          ))
      )}
  </div>
      </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "12px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: `1px solid ${DS.borderLight}`,
  boxSizing: "border-box",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: `1px solid ${DS.borderLight}`,
};

const tdStyle = {
  padding: "12px",
  borderBottom: `1px solid ${DS.borderLight}`,
};

function SummaryCard({ label, value, color }) {
  return (
    <div
      style={{
        marginBottom: "16px",
        paddingBottom: "16px",
        borderBottom: `1px solid ${DS.borderLight}`,
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: DS.textMuted,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── INVENTORY PAGE FINAL (FE2 UI + FE1 API) ──────────────────────────────
function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    modal: "",
    jual: "",
    min_stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();

      setProducts(
        response?.data?.data?.data ||
        response?.data?.data ||
        []
      );
    } catch (error) {
      console.error("Products error:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      await productService.create({
      ...formData,
      modal: parseInt(formData.modal, 10),
      jual: parseInt(formData.jual, 10),
      min_stock: parseInt(formData.min_stock, 10) || 0,
    });


      setShowModal(false);

      setFormData({
        name: "",
        sku: "",
        category: "",
        modal: "",
        jual: "",
        min_stock: "",
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Hapus produk ini?")) return;

    try {
      await productService.delete(id);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // statistik
  const totalProducts = products.length;

  const lowStock = products.filter(
    (p) =>
      Number(p.stock || 0) <=
      Number(p.min_stock || 10)
  ).length;

  return (
    <div style={{ paddingBottom: "32px" }}>
      {/* HEADER */}
      <div
        style={{
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: DS.textMain,
              marginBottom: "8px",
            }}
          >
            Kelola Stok Produk
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: DS.textSecond,
            }}
          >
            Pantau stok produk dan kelola inventaris bisnis Anda.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: DS.primary,
            color: "#FFFFFF",
            border: "none",
            borderRadius: "12px",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: DS.shadowMd,
          }}
        >
          + Tambah Produk
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <ProductModal
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddProduct}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <InventoryStatCard
          title="Total Produk"
          value={totalProducts}
          icon="📦"
        />

        <InventoryStatCard
          title="Stok Rendah"
          value={lowStock}
          icon="⚠️"
          danger
        />

        <InventoryStatCard
          title="Kategori"
          value={
            new Set(
              products.map((p) => p.category)
            ).size
          }
          icon="🏷️"
        />

        <InventoryStatCard
          title="Total Nilai"
          value={rp(
            products.reduce(
              (sum, p) =>
                sum +
                Number(p.modal || 0),
              0
            )
          )}
          icon="💰"
        />
      </div>

      {/* TABLE */}
      <div
        style={{
          backgroundColor: DS.bgCard,
          borderRadius: "16px",
          border: `1px solid ${DS.borderLight}`,
          overflow: "hidden",
          boxShadow: DS.shadowSm,
        }}
      >
        {isLoading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Loading...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: DS.bgLight,
                  }}
                >
                  <th style={inventoryThStyle}>
                    Nama Produk
                  </th>

                  <th style={inventoryThStyle}>
                    SKU
                  </th>

                  <th style={inventoryThStyle}>
                    Kategori
                  </th>

                  <th style={inventoryThStyle}>
                    Harga Modal
                  </th>

                  <th style={inventoryThStyle}>
                    Harga Jual
                  </th>

                  <th style={inventoryThStyle}>
                    Status
                  </th>

                  {/* <th style={inventoryThStyle}>
                    Aksi
                  </th> */}
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const isLow =
                    Number(
                      product.stock || 0
                    ) <=
                    Number(
                      product.min_stock ||
                        10
                    );

                  return (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: `1px solid ${DS.borderLight}`,
                      }}
                    >
                      <td style={inventoryTdStyle}>
                        <div>
                          <div
                            style={{
                              fontWeight:
                                "600",
                              color:
                                DS.textMain,
                            }}
                          >
                            {product.name}
                          </div>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                DS.textMuted,
                            }}
                          >
                            ID #
                            {product.id}
                          </div>
                        </div>
                      </td>

                      <td style={inventoryTdStyle}>
                        {product.sku}
                      </td>

                      <td style={inventoryTdStyle}>
                        {product.category}
                      </td>

                      <td style={inventoryTdStyle}>
                        {rp(
                          product.modal
                        )}
                      </td>

                      <td style={inventoryTdStyle}>
                        {rp(
                          product.jual
                        )}
                      </td>

                      <td style={inventoryTdStyle}>
                        <span
                          style={{
                            padding:
                              "6px 12px",
                            borderRadius:
                              "999px",
                            fontSize:
                              "12px",
                            fontWeight:
                              "600",
                            backgroundColor:
                              isLow
                                ? "#FEE2E2"
                                : "#DCFCE7",
                            color: isLow
                              ? "#DC2626"
                              : "#16A34A",
                          }}
                        >
                          {isLow
                            ? "Rendah"
                            : "Aman"}
                        </span>
                      </td>

                      {/* <td style={inventoryTdStyle}>
                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              product.id
                            )
                          }
                          style={{
                            background:
                              "none",
                            border:
                              "none",
                            cursor:
                              "pointer",
                            color:
                              DS.danger,
                          }}
                        >
                          <Icon
                            name="trash"
                            size={18}
                          />
                        </button>
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {products.length === 0 && (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color:
                    DS.textMuted,
                }}
              >
                Belum ada produk.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const inventoryThStyle = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "600",
  color: DS.textSecond,
};

const inventoryTdStyle = {
  padding: "14px 16px",
  fontSize: "14px",
  color: DS.textMain,
};

function InventoryStatCard({
  title,
  value,
  icon,
  danger = false,
}) {
  return (
    <div
      style={{
        backgroundColor: danger
          ? "#FFF5F5"
          : DS.bgCard,
        borderRadius: "16px",
        padding: "20px",
        border: danger
          ? "1px solid #FECACA"
          : `1px solid ${DS.borderLight}`,
      }}
    >
      <div
        style={{
          fontSize: "30px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: "13px",
          color: DS.textMuted,
          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: danger
            ? DS.danger
            : DS.textMain,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── AI PAGE FINAL ─────────────────────────────────────────────────────────
function AIPage() {
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState(null);

  const [productName, setProductName] = useState("");
  const [categoryResult, setCategoryResult] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(false);

  useEffect(() => {
    fetchAIData();
  }, []);

  const fetchAIData = async () => {
    try {
      const [insightRes, salesRes] = await Promise.all([
        aiService.getInsights(),
        aiService.predictSales("month"),
      ]);

      setInsights(
        insightRes?.data?.data || []
      );

      setPredictions(
        salesRes?.data?.data || null
      );
    } catch (error) {
      console.error("AI error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorize = async () => {
    if (!productName.trim()) return;

    setLoadingCategory(true);

    try {
      const response =
        await aiService.categorizeProduct({
          name: productName,
          category: "",
        });

      setCategoryResult(
        response?.data?.data
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCategory(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          color: DS.textSecond,
        }}
      >
        Memuat AI Insights...
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "32px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: DS.textMain,
            marginBottom: "8px",
          }}
        >
          AI Business Intelligence
        </h1>

        <p
          style={{
            color: DS.textSecond,
            fontSize: "14px",
          }}
        >
          Insight otomatis, prediksi penjualan,
          dan analisis produk berbasis AI.
        </p>
      </div>

      {/* TOP CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Prediksi */}
        <div
          style={{
            backgroundColor: DS.bgCard,
            borderRadius: "16px",
            padding: "24px",
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadowSm,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: DS.textMuted,
              marginBottom: "10px",
            }}
          >
            📈 Prediksi Penjualan
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: DS.primary,
            }}
          >
            {rp(
              predictions?.predicted_sales || 0
            )}
          </div>

          <div
            style={{
              marginTop: "10px",
              fontSize: "13px",
              color: DS.textSecond,
            }}
          >
            Growth Rate:{" "}
            {(
              (predictions?.growth_rate || 0) *
              100
            ).toFixed(0)}
            %
          </div>
        </div>

        {/* Rata-rata harian */}
        <div
          style={{
            backgroundColor: DS.bgCard,
            borderRadius: "16px",
            padding: "24px",
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadowSm,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: DS.textMuted,
              marginBottom: "10px",
            }}
          >
            💰 Rata-rata Harian
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: DS.success,
            }}
          >
            {rp(
              predictions?.average_daily || 0
            )}
          </div>
        </div>

        {/* Historis */}
        <div
          style={{
            backgroundColor: DS.bgCard,
            borderRadius: "16px",
            padding: "24px",
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadowSm,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: DS.textMuted,
              marginBottom: "10px",
            }}
          >
            📊 Penjualan Historis
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: DS.info,
            }}
          >
            {rp(
              predictions?.historical_sales ||
                0
            )}
          </div>
        </div>
      </div>

      {/* INSIGHTS */}
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "16px",
            color: DS.textMain,
          }}
        >
          🧠 AI Insights
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: "16px",
          }}
        >
          {insights.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: DS.bgCard,
                borderRadius: "16px",
                padding: "20px",
                border: `1px solid ${DS.borderLight}`,
                boxShadow: DS.shadowSm,
              }}
            >
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: DS.textMain,
                  marginBottom: "10px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: DS.textSecond,
                  lineHeight: "1.6",
                }}
              >
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT CATEGORIZER */}
      <div
        style={{
          backgroundColor: DS.bgCard,
          borderRadius: "16px",
          padding: "24px",
          border: `1px solid ${DS.borderLight}`,
          boxShadow: DS.shadowSm,
        }}
      >
        <h2
          style={{
            marginBottom: "8px",
            color: DS.textMain,
          }}
        >
          🏷️ AI Product Categorizer
        </h2>

        <p
          style={{
            marginBottom: "20px",
            color: DS.textSecond,
            fontSize: "13px",
          }}
        >
          Masukkan nama produk dan AI akan
          menentukan kategori terbaik.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <input
            value={productName}
            onChange={(e) =>
              setProductName(e.target.value)
            }
            placeholder="Contoh: Kopi Arabika Premium"
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: "10px",
              border: `1px solid ${DS.borderLight}`,
              outline: "none",
              fontSize: "14px",
            }}
          />

          <button
            onClick={handleCategorize}
            disabled={loadingCategory}
            style={{
              backgroundColor: DS.primary,
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              padding: "0 20px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {loadingCategory
              ? "Analisis..."
              : "Analisis"}
          </button>
        </div>

        {categoryResult && (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: DS.tertiary,
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                marginBottom: "10px",
                fontWeight: "600",
                color: DS.textMain,
              }}
            >
              Hasil Analisis
            </div>

            <div
              style={{
                marginBottom: "8px",
                color: DS.textSecond,
              }}
            >
              <strong>Kategori:</strong>{" "}
              {categoryResult.label}
            </div>

            <div
              style={{
                color: DS.textSecond,
              }}
            >
              <strong>Confidence:</strong>{" "}
              {(
                categoryResult.confidence *
                100
              ).toFixed(0)}
              %
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REPORTS PAGE ────────────────────────────────────────────────
function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log("reportData", reportData);
  console.log("category_breakdown", reportData?.category_breakdown);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await analyticsService.getDashboard();
      setReportData(response.data.data);
    } catch (error) {
      console.error("Report error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: DS.textSecond,
        }}
      >
        Memuat laporan...
      </div>
    );
  }

  const pieColors = [
    DS.primary,
    DS.secondary,
    DS.success,
    DS.warning,
    DS.danger,
  ];

  const pieData = (reportData?.category_breakdown || []).map(item => ({
    name: item.name,
    value: Number(item.value),
  }));

  return (
    <div style={{ paddingBottom: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: DS.textMain,
            marginBottom: "8px",
          }}
        >
          Laporan Keuangan
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: DS.textSecond,
          }}
        >
          Visualisasi dan analisis performa bisnis Anda.
        </p>
      </div>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Revenue */}
        <div
          style={{
            backgroundColor: DS.bgCard,
            borderRadius: "12px",
            padding: "20px",
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadowSm,
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: DS.textSecond,
              marginBottom: "10px",
            }}
          >
            Total Pemasukan
          </p>

          <h2
            style={{
              fontSize: "34px",
              fontWeight: "700",
              color: DS.success,
            }}
          >
            {rp(reportData.total_revenue)}
          </h2>
        </div>

        {/* Expense */}
        <div
          style={{
            backgroundColor: DS.bgCard,
            borderRadius: "12px",
            padding: "20px",
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadowSm,
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: DS.textSecond,
              marginBottom: "10px",
            }}
          >
            Total Pengeluaran
          </p>

          <h2
            style={{
              fontSize: "34px",
              fontWeight: "700",
              color: DS.danger,
            }}
          >
            {rp(reportData.total_expenses)}
          </h2>
        </div>

        {/* Profit */}
        <div
          style={{
            backgroundColor: DS.bgCard,
            borderRadius: "12px",
            padding: "20px",
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadowSm,
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: DS.textSecond,
              marginBottom: "10px",
            }}
          >
            Laba Bersih
          </p>

          <h2
            style={{
              fontSize: "34px",
              fontWeight: "700",
              color: DS.success,
            }}
          >
            {rp(reportData.profit)}
          </h2>

          <span
            style={{
              color: DS.success,
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Profitable 🎉
          </span>
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
        }}
      >
        {/* Line Chart */}
        <div
          style={{
            backgroundColor: DS.bgCard,
            borderRadius: "12px",
            padding: "20px",
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadowSm,
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: DS.textMain,
              marginBottom: "20px",
            }}
          >
            Pemasukan vs Pengeluaran (30 Hari)
          </h3>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={reportData.revenue_chart}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
              />

              <YAxis
                tick={{ fontSize: 11 }}
              />

              <Tooltip
                formatter={(value) => rp(value)}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke={DS.success}
                strokeWidth={3}
                dot={false}
                name="Pemasukan"
              />

              <Line
                type="monotone"
                dataKey="expense"
                stroke={DS.danger}
                strokeWidth={3}
                dot={false}
                name="Pengeluaran"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div
          style={{
            backgroundColor: DS.bgCard,
            borderRadius: "12px",
            padding: "20px",
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadowSm,
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: DS.textMain,
              marginBottom: "20px",
            }}
          >
            Distribusi Pengeluaran
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              innerRadius={55}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={pieColors[index % pieColors.length]}
                />
              ))}
            </Pie>

              <Tooltip formatter={(value) => rp(value)} />
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              marginTop: "16px",
            }}
          >
            {reportData.category_breakdown.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor:
                        pieColors[index % pieColors.length],
                    }}
                  />

                  <span
                    style={{
                      color: DS.textMain,
                    }}
                  >
                    {item.name}
                  </span>
                </div>

                <span
                  style={{
                    fontWeight: "600",
                    color: DS.textSecond,
                  }}
                >
                  {rp(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          marginTop: "24px",
          backgroundColor: DS.bgCard,
          borderRadius: "12px",
          padding: "24px",
          border: `1px solid ${DS.borderLight}`,
          boxShadow: DS.shadowSm,
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: DS.textMain,
            marginBottom: "16px",
          }}
        >
          Ringkasan Bisnis
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                color: DS.textMuted,
              }}
            >
              Total Produk
            </p>

            <h3
              style={{
                color: DS.textMain,
              }}
            >
              {reportData.product_count}
            </h3>
          </div>

          <div>
            <p
              style={{
                fontSize: "12px",
                color: DS.textMuted,
              }}
            >
              Pendapatan
            </p>

            <h3
              style={{
                color: DS.success,
              }}
            >
              {rp(reportData.total_revenue)}
            </h3>
          </div>

          <div>
            <p
              style={{
                fontSize: "12px",
                color: DS.textMuted,
              }}
            >
              Pengeluaran
            </p>

            <h3
              style={{
                color: DS.danger,
              }}
            >
              {rp(reportData.total_expenses)}
            </h3>
          </div>

          <div>
            <p
              style={{
                fontSize: "12px",
                color: DS.textMuted,
              }}
            >
              Profit
            </p>

            <h3
              style={{
                color: DS.success,
              }}
            >
              {rp(reportData.profit)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────
function SettingsPage({ user }) {
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    business_name: "",
    business_category: "",
    business_address: "",
    business_phone: "",
    website: "",

    language: "Bahasa Indonesia",
    timezone: "(GMT+07:00) Jakarta",

    notification_daily: true,
    notification_low_stock: true,
    notification_ai_tips: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.getSettings();

      setFormData({
        ...formData,
        ...response.data.data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await settingsService.updateSettings(formData);

      alert("Pengaturan berhasil disimpan");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan pengaturan");
    }
  };

  const Toggle = ({ checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "50px",
        height: "26px",
        borderRadius: "20px",
        backgroundColor: checked
          ? DS.primary
          : DS.borderLight,
        position: "relative",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          position: "absolute",
          top: "3px",
          left: checked ? "26px" : "3px",
          transition: "0.3s",
        }}
      />
    </div>
  );

  if (isLoading) {
    return (
      <div style={{ padding: 40 }}>
        Memuat pengaturan...
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "32px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: DS.textMain,
            marginBottom: "8px",
          }}
        >
          Pengaturan Akun
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: DS.textSecond,
          }}
        >
          Kelola profil dan konfigurasi bisnis Anda.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "24px",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* PROFILE */}
          <div
            style={{
              backgroundColor: DS.bgCard,
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid ${DS.borderLight}`,
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: DS.primary,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "36px",
                  fontWeight: "700",
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <h3
                style={{
                  marginBottom: "6px",
                  color: DS.textMain,
                }}
              >
                {user?.name}
              </h3>

              <p
                style={{
                  color: DS.textMuted,
                  fontSize: "13px",
                }}
              >
                {user?.email}
              </p>
            </div>
          </div>

          {/* REGIONAL */}
          <div
            style={{
              backgroundColor: DS.bgCard,
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid ${DS.borderLight}`,
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                color: DS.primary,
              }}
            >
              🌍 Bahasa & Regional
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label>Pilih Bahasa</label>

              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    language: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option>Bahasa Indonesia</option>
                <option>English</option>
              </select>
            </div>

            <div>
              <label>Zona Waktu</label>

              <select
                value={formData.timezone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timezone: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option>(GMT+07:00) Jakarta</option>
                <option>(GMT+08:00) Singapore</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* BUSINESS */}
        <div
          style={{
            backgroundColor: DS.bgCard,
            borderRadius: "20px",
            padding: "24px",
            border: `1px solid ${DS.borderLight}`,
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              color: DS.primary,
              marginBottom: "24px",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            🏪 Informasi Bisnis
          </h3>

          {/* ROW 1 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={modalLabel}>
                Nama Bisnis
              </label>

              <input
                type="text"
                value={formData.business_name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business_name: e.target.value,
                  })
                }
                style={inputStyleSetting}
              />
            </div>

            <div>
              <label style={modalLabel}>
                Kategori Bisnis
              </label>

              <input
                type="text"
                value={formData.business_category || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business_category: e.target.value,
                  })
                }
                style={inputStyleSetting}
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div style={{ marginBottom: "16px" }}>
            <label style={modalLabel}>
              Alamat Bisnis
            </label>

            <textarea
              value={formData.business_address || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  business_address: e.target.value,
                })
              }
              style={{
                ...inputStyleSetting,
                minHeight: "90px",
                resize: "none",
              }}
            />
          </div>

          {/* ROW 3 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label style={modalLabel}>
                Nomor Telepon Bisnis
              </label>

              <input
                type="text"
                value={formData.business_phone || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business_phone: e.target.value,
                  })
                }
                style={inputStyleSetting}
              />
            </div>

            <div>
              <label style={modalLabel}>
                Website (Opsional)
              </label>

              <input
                type="text"
                value={formData.website || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    website: e.target.value,
                  })
                }
                style={inputStyleSetting}
                placeholder="www.websiteanda.com"
              />
            </div>
          </div>
        </div>

          {/* NOTIFICATION */}
          <div
            style={{
              backgroundColor: DS.bgCard,
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid ${DS.borderLight}`,
            }}
          >
            <h3
              style={{
                color: DS.primary,
                marginBottom: "20px",
              }}
            >
              🔔 Preferensi Notifikasi
            </h3>

            {[
              [
                "Laporan Harian",
                "notification_daily",
              ],
              [
                "Peringatan Stok Rendah",
                "notification_low_stock",
              ],
              [
                "Tips AI & Insight Finansial",
                "notification_ai_tips",
              ],
            ].map(([label, key]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 0",
                  borderBottom: `1px solid ${DS.borderLight}`,
                }}
              >
                <span>{label}</span>

                <Toggle
                  checked={formData[key]}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      [key]: value,
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button style={secondaryBtn}>
              Batalkan
            </button>

            <button
              onClick={handleSave}
              style={primaryBtn}
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyleSetting = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#F3F4F8",
  color: DS.textMain,
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none",
};

const primaryBtn = {
  background: `linear-gradient(135deg, ${DS.primary}, ${DS.primaryDark})`,
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.3s",
};

const secondaryBtn = {
  background: "#fff",
  color: DS.textMain,
  border: `1px solid ${DS.borderLight}`,
  padding: "12px 24px",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.3s",
};

const modalLabel = {
  display: "block",
  marginBottom: "8px",
  fontSize: "12px",
  fontWeight: "600",
  color: DS.textSecond,
};

const modalInput = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: `1px solid ${DS.borderLight}`,
  backgroundColor: "#FFFFFF",
  color: DS.textMain,
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const PRODUCT_CATEGORIES = [
  "Makanan & Minuman",
  "Bumbu & Rempah",
  "Bahan Pangan",
  "Minyak & Lemak",
  "Peralatan Dapur",
  "Kemasan",
  "Kebersihan",
];

function ProductModal({
  formData,
  setFormData,
  onSubmit,
  onClose,
}) {
  const [loadingAI, setLoadingAI] =
    useState(false);

  // const profit =
  //   Number(formData.jual || 0) -
  //   Number(formData.modal || 0);

  const modalPrice = Number(formData.modal) || 0;
  const jualPrice = Number(formData.jual) || 0;
  const profit = jualPrice - modalPrice;

  // const margin =
  //   Number(formData.jual || 0) > 0
  //     ? (
  //         (profit /
  //           Number(formData.jual || 1)) *
  //         100
  //       ).toFixed(1)
  //     : 0;

  const margin =
  jualPrice > 0
    ? ((profit / jualPrice) * 100).toFixed(1)
    : "0.0";

  const handleAICategory = async () => {
    if (!formData.name) return;

    try {
      setLoadingAI(true);

      const response =
        await aiService.categorizeProduct({
          name: formData.name,
        });

      const result =
        response?.data?.data ||
        response?.data;

      const aiCategory = result?.label;

      if (
        PRODUCT_CATEGORIES.includes(
          aiCategory
        )
      ) {
        setFormData({
          ...formData,
          category: aiCategory,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15,23,42,.55)",
        backdropFilter: "blur(5px)",
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          backgroundColor:
            DS.bgCard,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: DS.shadowLg,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "24px",
            borderBottom: `1px solid ${DS.borderLight}`,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                color: DS.textMain,
              }}
            >
              Tambah Produk
            </h2>

            <p
              style={{
                marginTop: "6px",
                color: DS.textMuted,
                fontSize: "13px",
              }}
            >
              Tambahkan produk baru ke
              inventaris
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              border: "none",
              background:
                DS.bgLight,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div
            style={{
              padding: "24px",
            }}
          >
            {/* PRODUCT NAME */}
            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <label style={modalLabel}>
                Nama Produk
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name:
                        e.target.value,
                    })
                  }
                  placeholder="Contoh: Kopi Arabika Premium"
                  style={{
                    ...modalInput,
                    flex: 1,
                  }}
                />

                <button
                  type="button"
                  onClick={
                    handleAICategory
                  }
                  disabled={loadingAI}
                  style={{
                    background:
                      DS.primary,
                    color: "#fff",
                    border: "none",
                    padding:
                      "0 16px",
                    borderRadius:
                      "10px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "600",
                  }}
                >
                  {loadingAI
                    ? "..."
                    : "✨ AI"}
                </button>
              </div>
            </div>

            {/* SKU + CATEGORY */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "16px",
                marginBottom: "18px",
              }}
            >
              <div>
                <label
                  style={modalLabel}
                >
                  SKU
                </label>

                <input
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sku:
                        e.target.value,
                    })
                  }
                  style={modalInput}
                />
              </div>

              <div>
                <label style={modalLabel}>
                  Kategori
                </label>

                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  style={{
                    ...modalInput,
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    backgroundColor: "#fff",
                  }}
                >
                  <option value="">
                    Pilih Kategori
                  </option>

                  {PRODUCT_CATEGORIES.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PRICE */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={modalLabel}
                >
                  Harga Modal
                </label>

                <input
                  type="number"
                  required
                  value={formData.modal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      modal:
                        e.target.value,
                    })
                  }
                  style={modalInput}
                />
              </div>

              <div>
                <label
                  style={modalLabel}
                >
                  Harga Jual
                </label>

                <input
                  type="number"
                  required
                  value={formData.jual}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jual:
                        e.target.value,
                    })
                  }
                  style={modalInput}
                />
              </div>
            </div>

            {/* STOCK */}
            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <label style={modalLabel}>
                Minimum Stock
              </label>

              <input
                type="number"
                value={
                  formData.min_stock
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_stock:
                      e.target.value,
                  })
                }
                style={modalInput}
              />
            </div>

            {/* PROFIT CARD */}
            <div
              style={{
                background:
                  DS.bgLight,
                borderRadius: "14px",
                padding: "18px",
                border: `1px solid ${DS.borderLight}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color:
                        DS.textMuted,
                    }}
                  >
                    Keuntungan / Produk
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight:
                        "700",
                      color:
                        DS.success,
                    }}
                  >
                    {rp(profit)}
                  </div>
                </div>

                <div
                  style={{
                    textAlign:
                      "right",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color:
                        DS.textMuted,
                    }}
                  >
                    Margin
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight:
                        "700",
                      color:
                        DS.primary,
                    }}
                  >
                    {margin}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div
            style={{
              padding: "20px 24px",
              borderTop: `1px solid ${DS.borderLight}`,
              display: "flex",
              justifyContent:
                "flex-end",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                background:
                  DS.bgLight,
                border: "none",
                borderRadius:
                  "10px",
                padding:
                  "12px 20px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Batal
            </button>

            <button
              type="submit"
              style={{
                background:
                  DS.primary,
                color: "#fff",
                border: "none",
                borderRadius:
                  "10px",
                padding:
                  "12px 20px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}