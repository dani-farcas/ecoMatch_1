// 📁 ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🕓 Executat după ce DOM-ul este randat
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0); // 🔁 delay de 0ms = următorul ciclu de eveniment
  }, [pathname]);

  return null;
};

export default ScrollToTop;
