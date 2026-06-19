import { BrowserRouter, Routes, Route } from "react-router-dom";
import SocialConnect from "./pages/SocialConnect";
import ConnectPlatform from "./pages/ConnectPlatform";
import Success from "./pages/Success";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<SocialConnect />} />
        <Route path="/connect/:platform" element={<ConnectPlatform />} />
        <Route path="/success/:platform" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}