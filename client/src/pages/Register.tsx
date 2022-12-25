import React from "react";
import { useParams } from "react-router-dom";
import { Api } from "../api";
const initInput = {
  handle: "",
  email: "",
  password: "",
};
export const Register = () => {
  const { handle } = useParams();

  const [input, setInput] = React.useState(initInput);
  const [message, setMessage] = React.useState("");
  const handleChange = (e: any) => {};
  React.useEffect(() => {
    if (handle) {
      const checkIfExists = async () => {
        try {
          await Api.post("auth/exists?handle=" + handle);
          setMessage("Handle is available");
          setInput((s) => ({ ...s, handle }));
          window.location.replace("/suck"); // Check if exists on Landing
        } catch (e: any) {
          setMessage("Handle is taken");
        }
      };
      checkIfExists();
    }
  }, [handle]);

  return (
    <>
      <input value={input.handle} onChange={handleChange} />
      <h1>
        Register for {handle} {message}
      </h1>
    </>
  );
};
