import { Route, Routes } from "react-router-dom";
import { Landing, Register } from "./pages";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};
