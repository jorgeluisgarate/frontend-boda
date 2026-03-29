import { Routes, Route } from "react-router-dom";
import { WeddingApp } from "./WeddingApp.jsx";
import { SaraPage } from "./SaraPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WeddingApp />} />
      <Route path="/sara" element={<SaraPage />} />
    </Routes>
  );
}
