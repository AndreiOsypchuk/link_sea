import { ReactComponent as LinkSeaLogo } from "../../LinkSeaTab.svg";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiGithub, TfiMenu } from "react-icons/tfi";
import {
  IoMdMenu,
  IoLogoGithub,
  IoLogoTwitter,
  IoMdMail,
  IoMdClose,
} from "react-icons/io";
import React from "react";

const Ham = () => {
  const [openBurger, setOpenBurger] = React.useState(false);
  const handleOpen = () => {
    setOpenBurger(() => true);
    console.log("clicked burger");
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
        <div className="top-1 p-4 left-0 bg-indigo-100 scale-95 absolute w-full  rounded-md">
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
            <button className="underline text-teal-600/60">Sign In</button>
          </div>
        </div>
      )}
    </>
  );
};

export const Landing = () => {
  return (
    <div className="bg-indigo-900 h-screen flex flex-col justify-between">
      <nav className="bg-indigo-900 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center justify-between">
          {/* <Logo /> */}
          <LinkSeaLogo />
          <div className="px-2" />
          <h3 className="font-bold text-white  text-md ">Linksea</h3>
        </div>
        <Ham />
      </nav>
      <main className="mx-7">
        {/* TODO: Add image of laughing dude to the right idk */}
        <section>
          <h1 className="text-white text-3xl font-bold">
            Link everything you are proud of
          </h1>
          <i className="text-teal-400 text-3xl font-bold">Here.</i>
          <div className="m-2" />
          <p className="text-white text-sm font-semibold">
            Join over 15B+ people and link everything. All in one place. All in
            one link.
          </p>
        </section>

        <div className="m-12" />
        <form className="flex justify-between">
          <input
            className="h-12 px-3 py-1 rounded-lg w-3/5"
            placeholder="links.ea/yourhandle"
          />
          <button
            className="text-indigo-900 font-semibold bg-teal-400 px-4 rounded-lg"
            type="submit"
          >
            Lets go!
          </button>
        </form>
      </main>
      <footer className="p-5 text-indigo-300 bg-indigo-900 flex flex-col justify-center items-center  gap-9">
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
        <p className="text-xs">© 2022 Shyer Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};
