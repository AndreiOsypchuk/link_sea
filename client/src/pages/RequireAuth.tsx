import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { RootContext } from "../store";
interface Props {
  children: React.ReactElement;
}
export const RequireAuth: React.FC<Props> = ({ children }) => {
  const {
    store: { loggedIn },
  } = React.useContext(RootContext);
  if (loggedIn) return children;
  return <Navigate to="/" replace />;
};
