import { ReactComponent as LinkSeaLogo } from "../../LinkSeaTab.svg";
import {
  IoMdMenu,
  IoLogoGithub,
  IoLogoTwitter,
  IoMdMail,
  IoMdClose,
} from "react-icons/io";
import { CgSpinner } from "react-icons/cg";
import React, { ChangeEvent } from "react";

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
            <button className="underline text-teal-600/60">Sign In</button>
          </div>
        </div>
      )}
    </>
  );
};

const wait = async (amount: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("fetched stuff");
      resolve();
    }, amount);
  });
};

export const Landing = () => {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleInput = (e: any) => {
    const value = e.target.value;
    setInput((i) => value);
  };

  const handleSubmit = async (e: any) => {
    setLoading(() => true);
    e.preventDefault();
    console.log(input);
    await wait(4000);
    setLoading(() => false);
  };

  return (
    <div className="bg-indigo-900 h-auto flex flex-col justify-between relative">
      <nav className="z-20 py-6 px-6 flex justify-between items-center">
        <div className="flex items-center justify-between">
          {/* <Logo /> */}
          <LinkSeaLogo />
          <div className="px-2" />
          <h3 className="font-bold text-white  text-md ">Linksea</h3>
        </div>
        <Ham />
      </nav>
      <main className="px-6 h-screen">
        <div className="absolute rotate-180 w-full top-0 left-0 fill-white">
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
        <form className="flex justify-between" onSubmit={handleSubmit}>
          <input
            onChange={handleInput}
            className="h-12 px-3 py-1 rounded-full w-3/5"
            placeholder="links.ea/yourhandle"
          />
          <button
            disabled={loading || !input.length}
            className="text-indigo-900 w-24 flex items-center justify-center font-semibold bg-teal-400 hover:bg-teal-300 px-4 rounded-lg"
            type="submit"
          >
            {loading ? (
              <CgSpinner className="animate-spin  text-teal-600 text-2xl" />
            ) : (
              "Lets go!"
            )}
          </button>
        </form>
      </main>

      <footer className="relative z-50 p-5 text-indigo-300  bg-indigo-400/10 flex flex-col justify-center items-center  gap-4">
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
        <div className="z-30 absolute  w-full top-0 -translate-y-full  left-0 fill-indigo-400/10">
          {/* <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                className="fill-indigo-400/10"
              ></path>
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                className="fill-indigo-400/10"
              ></path>
              <path
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                className="fill-indigo-400/10"
              ></path>
            </svg> */}
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
