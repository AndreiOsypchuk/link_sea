import React, { FC } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ReactComponent as Logo } from "../../Logo.svg";
import {
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { Api } from "../api";
const initInput = {
  handle: "",
  email: "",
  password: "",
};

const initMessageState = {
  handle: {
    message: "",
    good: false,
    is: false,
  },
  email: {
    message: "",
    good: false,
    is: false,
  },
  password: {
    message: "",
    good: false,
    is: false,
  },
};

interface Message {
  message: string;
  good: boolean;
  is: boolean;
}

enum MessageActionTypes {
  HANDLE_TAKEN,
  EMAIL_INVALID,
  PASSWORD_INVALID,
  SERVER_ERROR,
  HANDLE_AVAILABLE,
}
interface ErrorAction {
  type: MessageActionTypes;
}
const messageReducer = (state = initMessageState, action: ErrorAction) => {
  switch (action.type) {
    case MessageActionTypes.HANDLE_TAKEN: {
      return {
        ...state,
        handle: { message: "Handle is already taken", good: false, is: true },
      };
    }
    case MessageActionTypes.EMAIL_INVALID: {
      return {
        ...state,
        email: { message: "Email is invalid", good: false, is: true },
      };
    }
    case MessageActionTypes.PASSWORD_INVALID: {
      return {
        ...state,
        password: {
          message: "Password must be at least  6 characters long",
          good: false,
          is: true,
        },
      };
    }
    case MessageActionTypes.SERVER_ERROR: {
      return {
        ...state,
        handle: {
          message: "Something happend to the server",
          good: false,
          is: true,
        },
      };
    }
    case MessageActionTypes.HANDLE_AVAILABLE: {
      return {
        ...state,
        handle: { message: "", good: true, is: true },
      };
    }
    default: {
      return state;
    }
  }
};

const wait = async (amount: number): Promise<void> => {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      console.log("fetched stuff");
      resolve();
    }, amount);
  });
};

export const Register = () => {
  const [params] = useSearchParams();
  const [input, setInput] = React.useState(initInput);
  const [messageState, dispatchMessage] = React.useReducer(
    messageReducer,
    initMessageState
  );
  const [loading, setLoading] = React.useState({ handle: false, main: false });
  const typingTimerId = React.useRef<number>(0);
  const handleChange = (e: any) => {
    const value = e.target.value;
    const field = e.target.name;
    // if (loading.handle) return;
    setInput((i) => ({ ...i, [field]: value }));
  };

  const handleHandleChange = async (e: any) => {
    clearTimeout(typingTimerId.current);

    // 5 sec ago ====================
    const checkIfExists = async () => {
      // if (previousReqRef.current === e.target.value) return;

      try {
        setLoading((l) => ({ ...l, handle: true }));
        // await wait(1500);
        const { data } = await Api.post("auth/exists?handle=" + e.target.value);

        setLoading((l) => ({ ...l, handle: false }));
        dispatchMessage({
          type: data.exists
            ? MessageActionTypes.HANDLE_TAKEN
            : MessageActionTypes.HANDLE_AVAILABLE,
        });
      } catch (e: any) {
        if (e.response.status === 400) {
          setLoading((l) => ({ ...l, handle: false }));

          dispatchMessage({ type: MessageActionTypes.HANDLE_TAKEN });
        } else {
          setLoading((l) => ({ ...l, handle: false }));

          dispatchMessage({
            type: MessageActionTypes.SERVER_ERROR,
          });
          console.log(e);
        }
      }
      setLoading((l) => ({ ...l, handle: false }));
    };
    if (e.target.value.length) {
      typingTimerId.current = setTimeout(checkIfExists, 700);
    }
  };

  React.useEffect(() => {
    const handle = params.get("handle");

    console.log(handle);
    if (handle) {
      setInput((s) => ({
        ...s,
        handle,
      }));
      const checkIfExists = async () => {
        try {
          setLoading((l) => ({ ...l, handle: true }));

          const { data } = await Api.post("auth/exists?handle=" + handle);
          dispatchMessage({
            type: data.exists
              ? MessageActionTypes.HANDLE_TAKEN
              : MessageActionTypes.HANDLE_AVAILABLE,
          });
          setLoading((l) => ({ ...l, handle: false }));
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
      };
      checkIfExists();
    }
  }, [params]);

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
        <form className="flex items-center flex-col w-full gap-4">
          <span className="flex items-center flex-col gap-3 w-full">
            <FromInput
              placeholder="links.ea/yourhandle"
              name="handle"
              value={input.handle}
              error={messageState.handle}
              onChange={handleChange}
              onKeyUp={handleHandleChange}
              loading={loading.handle}
            />
            <FromInput
              placeholder="Email"
              type="email"
              name="email"
              value={input.email}
              error={messageState.email}
              onChange={handleChange}
            />
            <FromInput
              placeholder="Password"
              name="password"
              type="password"
              value={input.password}
              error={messageState.password}
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
  error?: Message;
  loading?: boolean;
}
const FromInput: FC<formInputProps> = ({ error, loading, ...props }) => {
  return (
    <div className="w-full">
      {error?.message.length ? (
        <p className="text-red-500 w-full text-xs font-semibold mb-1">
          {error.message}
        </p>
      ) : null}
      <span className="w-full relative flex items-center">
        <input
          {...props}
          className={`rounded-md px-3 pr-10 py-3 w-full ${
            error?.is
              ? error?.good
                ? "border-2 border-green-500 outline-green-500"
                : "border-2 border-red-500 outline-red-500"
              : "border-2 border-zinc-50/10"
          }`}
        />
        {loading ? (
          <span className="absolute top-1/2 -translate-y-1/2 right-3.5">
            <AiOutlineLoading3Quarters className="  text-zinc-800 animate-spin" />
          </span>
        ) : error?.is ? (
          error?.good ? (
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
