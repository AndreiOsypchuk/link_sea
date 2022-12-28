import { Route, Routes } from "react-router-dom";
import { Landing, Register, Home, RequireAuth } from "./pages";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/:handle"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
    </Routes>
  );
};
