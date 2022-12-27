import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Api } from "../api";
const initInput = {
  handle: "",
  email: "",
  password: "",
};
export const Register = () => {
  // const { handle } = useParams();
  const [params] = useSearchParams();
  const [input, setInput] = React.useState(initInput);
  const [message, setMessage] = React.useState("");
  const handleChange = (e: any) => {};
  React.useEffect(() => {
    const handle = params.get("handle");
    if (handle) {
      const checkIfExists = async () => {
        try {
          await Api.post("auth/exists?handle=" + handle);
          setMessage("Handle is available");
          setInput((s) => ({
            ...s,
            handle,
          }));

          //window.location.replace("/suck"); // Check if exists on Landing
        } catch (e: any) {
          console.log(e);
          setMessage("Handle is taken");
        }
      };
      checkIfExists();
    }
  }, [params]);

  return (
    <>
      <input value={input.handle} onChange={handleChange} />
      <h1>
        Register for {params.get("handle")} {message}
      </h1>
    </>
  );
};
