import { useEffect, useState } from "react";
import { Toaster } from "./components/ui/sonner";
import Admin from "./pages/Admin";
import Home from "./pages/Home";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowInstallBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  return (
    <>
      {currentPath.startsWith("/admin") ? <Admin /> : <Home />}
      <Toaster position="top-center" richColors />

      {showInstallBanner && installPrompt && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#4E342E",
            color: "#F5F5DC",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "320px",
            width: "calc(100% - 40px)",
            fontFamily: "Lato, sans-serif",
          }}
        >
          <div style={{ fontSize: "28px" }}>🪑</div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: "700",
                fontSize: "13px",
                marginBottom: "2px",
              }}
            >
              App Install Karein
            </div>
            <div style={{ fontSize: "11px", opacity: 0.85 }}>
              Home screen pe add karein -- jaldi access karein
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button
              type="button"
              onClick={handleInstall}
              style={{
                backgroundColor: "#C8A951",
                color: "#4E342E",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => setShowInstallBanner(false)}
              style={{
                backgroundColor: "transparent",
                color: "#F5F5DC",
                border: "1px solid rgba(245,245,220,0.3)",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "11px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Baad mein
            </button>
          </div>
        </div>
      )}
    </>
  );
}
