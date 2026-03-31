import { useEffect, useState } from "react";
import { Toaster } from "./components/ui/sonner";
import Admin from "./pages/Admin";
import Home from "./pages/Home";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>
      {currentPath.startsWith("/admin") ? <Admin /> : <Home />}
      <Toaster position="top-center" richColors />
    </>
  );
}
