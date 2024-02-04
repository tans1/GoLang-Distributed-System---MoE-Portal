import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./pages/home";
import ResultUploading from "./pages/resultUploading";
import ResultDisplay from "./pages/resultDisplay";
import Petition from "./pages/petition";
import PetitionsList from "./pages/petitionsList";
import PetitionCreation from "./pages/petitionCreation";

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
        <Route path="/petitions" element={<PetitionsList />} />
        <Route path="/create-petition" element={<PetitionCreation />} />
        <Route path="/petition" element={<Petition />} />

        <Route path="/upload" element={<ResultUploading />} />
        {/* <Route element={<ProtectRoutes />}>
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
