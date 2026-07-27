// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import NightSky from "./pages/NightSky";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/night-sky" element={<NightSky />} />
      </Routes>
    </BrowserRouter>
  );
}