import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// 1. Import AuthProvider từ file context của bạn
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      {/* Xóa <BrowserRouter> ở đây */}
      <App /> {/* App đã có Router bên trong rồi */}
    </AuthProvider>
  </StrictMode>,
);
