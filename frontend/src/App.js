import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./pages/home";
import ResultUploading from "./pages/resultUploading";
import ResultDisplay from "./pages/resultDisplay";
import Petition from "./pages/petition";

import ProtectRoutes from "./protectRoutes";
import Login from "./pages/login";
import SignUp from "./pages/signup";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<ResultDisplay />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/petition" element={<Petition />} />
        <Route element={<ProtectRoutes />}>
          <Route path="/upload" element={<ResultUploading />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
