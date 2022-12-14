import { ReactComponent as LinkSeaLogo } from "../../Logo.svg";
// import { ReactComponent as LinkSeaLogo } from "../../LinkSeaTab.svg";
import {
  IoMdMenu,
  IoLogoGithub,
  IoLogoTwitter,
  IoMdMail,
  IoMdClose,
} from "react-icons/io";
import React from "react";
import { Link } from "react-router-dom";

const Ham = () => {
  const [openBurger, setOpenBurger] = React.useState(false);
  const handleOpen = () => {
    setOpenBurger(() => true);
  };
  const handleClose = () => {
    setOpenBurger(() => false);
  };
  return (
    <>
      <div className="p-1 flex justify-center items-center">
        <button onClick={handleOpen}>
          <IoMdMenu className="w-6 h-6 text-white flex justify-center items-center" />
        </button>
      </div>
      {openBurger && (
        <div className="z-20 top-1 p-4 left-0 bg-indigo-100 scale-95 absolute w-full  rounded-md">
          <section className="flex justify-between mb-4">
            <p className="text-indigo-900 font-bold text-3xl">Take a look!</p>
            <button onClick={handleClose}>
              <IoMdClose className="w-7 h-7 text-indigo-900" />
            </button>
          </section>
          <ul className="my-8 flex flex-col gap-4  font-semibold">
            <li>Features</li>
            <li>About Us</li>
            <li>Pricing</li>
          </ul>
          <div className="flex  items-center py-4">
            <p className=" text-teal-600/60">Have the account?</p>
            <div className="m-3" />
            <Link to="/sign-in" className="underline text-teal-600/60">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export const Landing = () => {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const handleInput = (e: any) => {
    const value = e.target.value;
    setInput((i) => value);
  };
  React.useEffect(() => {
    const callback = (e: any) => {
      if (e.charCode === 13) {
        linkRef.current?.click();
      }
    };
    inputRef.current?.addEventListener("keypress", callback);
    return () => {
      inputRef.current?.removeEventListener("keypress", callback);
    };
  }, []);
  return (
    <div className="bg-zinc-900 h-full flex flex-col justify-between relative bg-[url('/Hero.svg')] bg-repeat overflow-x-hidden">
      <nav className="z-20 py-6 px-6 flex justify-between items-center">
        <div className="flex items-center justify-between">
          <LinkSeaLogo className="" />
          <div className="px-2" />
          {/* <h3 className="font-bold text-zinc-100 text-md ">Linksea</h3> */}
        </div>
        <Ham />
      </nav>
      <main className=" h-full">
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

        <section className="px-6 my-24 pb-12 ">
          <h1 className="text-zinc-200 text-3xl font-bold">
            Link everything you are proud of
          </h1>
          <i className="text-teal-500 text-3xl font-bold">Here.</i>
          <div className="m-2" />
          <p className="text-zinc-100 text-sm font-semibold">
            Join over 15B+ people and link everything. All in one place. All in
            one link.
          </p>
          <div className="m-12" />
          <div className="flex justify-between">
            <input
              ref={inputRef}
              onChange={handleInput}
              value={input}
              className="h-12 px-4 py-3 rounded-full w-3/5 bg-zinc-100"
              placeholder="links.ea/yourhandle"
            />
            <Link
              ref={linkRef}
              to={input.length ? `/register?handle=${input.toLowerCase()}` : ""}
              className="text-zinc-200 w-fit flex items-center justify-center font-semibold bg-teal-600 border border-teal-700 hover:bg-teal-700 hover:border-teal-800 px-4 rounded-lg"
              type="submit"
            >
              Lets go!
            </Link>
          </div>
        </section>

        <section className="px-7   text-indigo-900 py-12 bg-zinc-100  ">
          <h1 className="font-bold text-3xl mb-4">
            Complete controll over{" "}
            <span className="bg-indigo-900 text-teal-400 px-2">
              how it looks!
            </span>
          </h1>
          <p className="text-indigo-900 mb-12">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque rem
            officia eum tempore facilis repellat aut libero, ad possimus commodi
            deserunt. Iste nobis laborum ut cumque possimus, saepe sit
            similique?
          </p>
          <Link
            to="/register"
            className="max-w-fit text-teal-400 h-12 flex items-center justify-center font-semibold bg-indigo-900 hover:bg-indigo-800 px-4 rounded-lg"
          >
            "Get started for free!"
          </Link>
        </section>
        <section className="px-7   text-white py-12 ">
          <h1 className="font-bold text-3xl mb-4">
            Complete controll over{" "}
            <span className="bg-teal-400 px-2">how it looks!</span>
          </h1>
          <p className="text-teal-400 mb-12">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque rem
            officia eum tempore facilis repellat aut libero, ad possimus commodi
            deserunt. Iste nobis laborum ut cumque possimus, saepe sit
            similique?
          </p>
          <Link
            to="/register"
            className="max-w-fit text-white h-12 flex items-center justify-center font-semibold bg-teal-400 hover:bg-teal-300 px-4 rounded-lg"
          >
            "Get started for free!"
          </Link>
        </section>
      </main>

      <footer className="relative z-50 pb-5 pt-1 mt-12 text-zinc-300  bg-zinc-400/10 flex flex-col justify-center items-center  gap-4">
        <div className="flex items-center justify-between w-3/6">
          <a href="https://github.com/AndreiOsypchuk/link_sea" target="_blank">
            <IoLogoGithub className="w-6 h-6 " />
          </a>
          <a href="https://github.com/AndreiOsypchuk/link_sea" target="_blank">
            <IoLogoTwitter className="w-6 h-6" />
          </a>
          <a href="https://github.com/AndreiOsypchuk/link_sea" target="_blank">
            <IoMdMail className="w-6 h-6" />
          </a>
        </div>
        <p className="text-xs text-zinc-300/25">
          ?? 2022 Shyer Inc. All rights reserved.
        </p>
        <div className="z-30 absolute  w-full top-0 -translate-y-full  left-0 fill-zinc-400/10">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
          </svg>
        </div>
      </footer>
    </div>
  );
};
