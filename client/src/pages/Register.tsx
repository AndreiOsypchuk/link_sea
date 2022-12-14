import React, { FC } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../Logo.svg";
import { useQuery } from "react-query";
import {
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { Api } from "../api";
import { RootActionType, RootContext } from "../store";
// TODO: This is a mess
const initInput = {
  handle: "",
  email: "",
  password: "",
};
enum StateCase {
  GOOD,
  INIT,
  BAD,
}
const initMessageState = {
  handle: {
    message: "",
    state: StateCase.INIT,
    is: false,
  },
  email: {
    message: "",
    state: StateCase.INIT,

    is: false,
  },
  password: {
    message: "",
    state: StateCase.INIT,

    is: false,
  },
};
interface Message {
  message: string;
  state: StateCase;
  is: boolean;
}

enum MessageActionTypes {
  HANDLE_TAKEN,
  EMAIL_INVALID,
  PASSWORD_INVALID,
  SERVER_ERROR,
  HANDLE_VALID,
  HANDLE_INVALID,
  CLEAR,
}
interface MessageAction {
  type: MessageActionTypes;
  message?: string;
}
// TODO: wtf
const messageReducer = (state = initMessageState, action: MessageAction) => {
  switch (action.type) {
    case MessageActionTypes.HANDLE_TAKEN: {
      return {
        ...state,
        handle: {
          message: "Handle is already taken",
          state: StateCase.BAD,
          is: true,
        },
      };
    }
    case MessageActionTypes.EMAIL_INVALID: {
      return {
        ...state,
        email: { message: "Email is invalid", state: StateCase.BAD, is: true },
      };
    }
    case MessageActionTypes.PASSWORD_INVALID: {
      return {
        ...state,
        password: {
          message: "Password must be at least  6 characters long",
          state: StateCase.BAD,
          is: true,
        },
      };
    }
    case MessageActionTypes.SERVER_ERROR: {
      return {
        ...state,
        handle: {
          message: "Something happend to the server",
          state: StateCase.BAD,
          is: true,
        },
      };
    }
    case MessageActionTypes.HANDLE_VALID: {
      return {
        ...state,
        handle: { message: "", state: StateCase.GOOD, is: true },
      };
    }
    case MessageActionTypes.HANDLE_INVALID: {
      return {
        ...state,
        handle: {
          message: action.message || "Handle is wrong",
          state: StateCase.BAD,
          is: true,
        },
      };
    }
    case MessageActionTypes.CLEAR: {
      return initMessageState;
    }
    default: {
      return state;
    }
  }
};

const wait = async (amount: number): Promise<void> => {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve();
    }, amount);
  });
};
interface ExistsResponse {
  exists: boolean;
}

const validHandle: RegExp = /^[a-z][a-z0-9-_]{3,32}$/;

export const Register = () => {
  const [params] = useSearchParams();
  const [input, setInput] = React.useState(initInput);
  const [messageState, dispatchMessage] = React.useReducer(
    messageReducer,
    initMessageState
  );
  const [loading, setLoading] = React.useState({ handle: false, main: false });
  const typingTimerId = React.useRef<number>(0);
  const urlCache = React.useRef(new Map<string, boolean>()); // caching urls here and responses to prevent too many requests
  const { isLoading } = useQuery(
    ["validate-handle"],
    async () => {
      const handle = params.get("handle");
      if (handle) {
        setInput((s) => ({ ...s, handle }));
        try {
          const url = "auth/exists?handle=" + handle;
          const response = await Api.post<ExistsResponse>(
            "auth/exists?handle=" + handle
          );
          urlCache.current.set(url, response.data.exists);
          dispatchMessage({
            type: response.data.exists
              ? MessageActionTypes.HANDLE_TAKEN
              : MessageActionTypes.HANDLE_VALID,
          });
          return response.data;
        } catch (e: any) {
          if (e.response.status === 400) {
            dispatchMessage({ type: MessageActionTypes.HANDLE_TAKEN });
          } else {
            dispatchMessage({
              type: MessageActionTypes.SERVER_ERROR,
            });
            console.log(e);
          }
        }
      }
    },
    { refetchOnWindowFocus: false }
  );
  const handleChange = (e: any) => {
    let value = e.target.value;
    const field = e.target.name;
    if (field === "handle") {
      // const validate = /^[a-z][a-z0-9-_]{3,32}$/;
      // console.log(value, "is correct", validate.test(value));
      // value.toLowerCase();
      if (e.target.value.length <= 3) {
        dispatchMessage({
          type: MessageActionTypes.HANDLE_INVALID,
          message: "Handle must be at least 4 characters long",
        });
      } else if (!validHandle.test(value)) {
        dispatchMessage({
          type: MessageActionTypes.HANDLE_INVALID,
          message:
            "Handle can have only alphanumeric characters and underscores",
        });
      } else {
        dispatchMessage({ type: MessageActionTypes.HANDLE_VALID });
      }
    } else if (field === "email") {
      // TODO:
    } else if (field === "password") {
      // TODO:
    }
    setInput((i) => ({ ...i, [field]: value }));
  };

  // FIXME: something with state of the label being set before api call fullfills should set to INIT state when typing
  const handleKeySearch = async (e: any) => {
    setLoading((l) => ({ ...l, handle: true }));
    if (validHandle.test(e.target.value)) {
      // Clear previous timeout set on keyUp
      clearTimeout(typingTimerId.current);
      // Start spining the spinner
      // Check cache
      const url = `auth/exists?handle=${e.target.value}`;
      // Pretend we are fetching
      if (urlCache.current.has(url)) {
        // Retrieve previous api result from cache
        const result = urlCache.current.get(url);

        // Display label on handle input
        dispatchMessage({
          type: result
            ? MessageActionTypes.HANDLE_TAKEN
            : MessageActionTypes.HANDLE_VALID,
        });
      } else {
        // If it's a cache miss check if handle is taken

        const validateOnKeyPress = async () => {
          try {
            // Make an API call
            const {
              data: { exists },
            } = await Api.post<ExistsResponse>(url);
            // Cache response and url for later
            urlCache.current.set(url, exists);

            // Display label on handle input
            dispatchMessage({
              type: exists
                ? MessageActionTypes.HANDLE_TAKEN
                : MessageActionTypes.HANDLE_VALID,
            });
          } catch (e: any) {
            console.log(e);
          }
        };
        typingTimerId.current = setTimeout(validateOnKeyPress, 700);
      }
      // Stop spinning
    }
    setLoading((l) => ({ ...l, handle: false }));
  };

  const { dispatch } = React.useContext(RootContext);
  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await Api.post("auth/register", input);
      dispatch({ type: RootActionType.LOGIN });
      navigate("/" + input.handle, { replace: true });
      console.log(res);
    } catch (e: any) {
      if (e.response?.status === 400) {
        console.log(e.response.data);
        dispatchMessage({
          type: MessageActionTypes.HANDLE_INVALID,
          message: e.response.data.message,
        });
      } else {
        console.log(e);
      }
    }
  };

  // const handleKeySearch1 = async (e: any) => {
  //   clearTimeout(typingTimerId.current);
  //   const url = `auth/exists?handle=${e.target.value}`;
  //   setLoading((l) => ({ ...l, handle: true }));
  //   if (urlCache.current.has(url)) {
  //     // if url is in the cache map we pretend we are fetching by waiting half a second and showing a spinner
  //     await wait(500);
  //     setLoading((l) => ({ ...l, handle: false }));
  //     dispatchMessage({
  //       type: urlCache.current.get(url)
  //         ? MessageActionTypes.HANDLE_TAKEN
  //         : MessageActionTypes.HANDLE_VALID,
  //     });
  //     return;
  //   }
  //   // 5 sec ago ====================
  //   const checkIfExists = async () => {
  //     try {
  //       const { data } = await Api.post<ExistsResponse>(url);
  //       urlCache.current.set(url, data.exists);
  //       dispatchMessage({
  //         type: data.exists
  //           ? MessageActionTypes.HANDLE_TAKEN
  //           : MessageActionTypes.HANDLE_VALID,
  //       });
  //       setLoading((l) => ({ ...l, handle: false }));
  //     } catch (e: any) {
  //       if (e.response.status === 400) {
  //         setLoading((l) => ({ ...l, handle: false }));
  //         dispatchMessage({ type: MessageActionTypes.HANDLE_TAKEN });
  //       } else {
  //         setLoading((l) => ({ ...l, handle: false }));
  //         dispatchMessage({
  //           type: MessageActionTypes.SERVER_ERROR,
  //         });
  //         console.log(e);
  //       }
  //     }
  //   };
  //   if (validHandle.test(e.target.value)) {
  //     typingTimerId.current = setTimeout(checkIfExists, 700);
  //   } else {
  //     setLoading((l) => ({ ...l, handle: false }));
  //   }
  // };

  return (
    <div className="h-screen overflow-scroll w-screen flex flex-col bg-[url('/Hero.svg')] bg-zinc-900">
      <header className="flex grow-0 items-center p-6 relative">
        <Link to="/">
          <Logo className="mt-2" />
        </Link>
        <div className="absolute rotate-180 w-full top-0 left-0 fill-zinc-100">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="h-7 w-full"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </header>
      <main className="p-6 flex flex-col items-center  w-full grow">
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-teal-500">
            Create your account
          </h1>
          <p className="text-zinc-200 mt-4 text-sm">
            Choose your Linksea handle. You can always change it later
          </p>
        </section>
        <form
          onSubmit={handleSubmit}
          className="flex items-center flex-col w-full gap-4"
        >
          <span className="flex items-center flex-col gap-3 w-full">
            <FromInput
              placeholder="links.ea/yourhandle"
              name="handle"
              value={input.handle}
              info={messageState.handle}
              onChange={handleChange}
              onKeyUp={handleKeySearch}
              loading={loading.handle || isLoading}
            />
            <FromInput
              placeholder="Email"
              type="email"
              name="email"
              value={input.email}
              info={messageState.email}
              onChange={handleChange}
            />
            <FromInput
              placeholder="Password"
              name="password"
              type="password"
              value={input.password}
              info={messageState.password}
              onChange={handleChange}
            />
          </span>
          <span className="text-zinc-300/30 text-xs mt-3">
            By clicking "Create account" you agree to all the terms and
            services. Also you will be required to sacrifice your first child to
            the lord.
          </span>
          <button className="text-zinc-200 w-full rounded-full  py-3 flex items-center justify-center font-semibold bg-teal-600 border border-teal-700 hover:bg-teal-700 hover:border-teal-800 px-4 ">
            Create account
          </button>
        </form>
      </main>
    </div>
  );
};
interface formInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  info?: Message;
  loading?: boolean;
}
const FromInput: FC<formInputProps> = ({ info, loading, ...props }) => {
  return (
    <div className="w-full">
      {info?.message.length ? (
        <p className="text-red-500 w-full text-xs font-semibold mb-1 animate-shake">
          {info.message}
        </p>
      ) : null}
      <span className="w-full relative flex items-center">
        <input
          {...props}
          className={`rounded-md px-3 pr-10 py-3 w-full ${
            info?.is
              ? info?.state === StateCase.GOOD
                ? "border-2 border-green-500 outline-green-500"
                : "border-2 border-red-500 outline-red-500"
              : "border-2 border-zinc-50/10"
          }`}
        />
        {loading ? (
          <span className="absolute top-1/2 -translate-y-1/2 right-3.5">
            <AiOutlineLoading3Quarters className="  text-zinc-800 animate-spin" />
          </span>
        ) : info?.is ? (
          info?.state === StateCase.GOOD ? (
            <span className="absolute top-1/2 -translate-y-1/2 right-3">
              <AiOutlineCheckCircle className="  text-green-500 h-5 w-5" />
            </span>
          ) : (
            <span className="absolute top-1/2 -translate-y-1/2 right-3">
              <AiOutlineExclamationCircle className="  h-5 w-5 text-red-500" />
            </span>
          )
        ) : null}
      </span>
    </div>
  );
};
// This is a thing that is a thing hello wthis is a thing and dynamo db and mongo to an extent that it is a premature optimization
