import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Api } from "../api";
import { RootActionType, RootContext } from "../store";
interface ExistsResponse {
  exists: boolean;
}
export const Home = () => {
  const { dispatch } = React.useContext(RootContext);
  const handleLogOut = () => {
    dispatch({ type: RootActionType.LOGOUT });
  };
  const { handle } = useParams<{ handle: string }>();
  const { data, isLoading } = useQuery(["exists"], async () => {
    let result = false;
    if (handle) {
      try {
        const { data } = await Api.post<ExistsResponse>(
          "auth/exists?handle=" + handle
        );

        result = data.exists;
      } catch (e: any) {}
    }
    return result;
  });
  return data ? (
    <>
      <h1>Home page </h1>
      <button onClick={handleLogOut}>Log out</button>
    </>
  ) : (
    <h1>No page for handle {handle}</h1>
  );
};
