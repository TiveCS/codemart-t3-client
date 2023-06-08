import { type SetStateAction } from "react";
import Image from "next/image";
import SideNavbarItem from "./SideNavbarItem";
import {
  ArrowLeftOnRectangleIcon,
  CodeBracketIcon,
  HomeIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";

interface SideNavbarProps {
  isOpen: boolean;
  setIsOpen: (state: SetStateAction<boolean>) => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ isOpen, setIsOpen }) => {
  const { data: session, status } = useSession();

  return (
    <>
      <div
        id="side-navbar"
        className={`${
          isOpen ? "grid" : "hidden"
        } fixed top-0 right-0 z-50 grid h-screen w-screen grid-flow-col`}
      >
        <div
          id="side-navbar-close"
          className="absolute top-0 right-0 p-4"
          onClick={() => setIsOpen(false)}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </div>

        <div
          id="side-navbar-overlay"
          className="col-span-3 bg-black opacity-20 md:col-span-8"
          onClick={() => setIsOpen(false)}
        ></div>

        <div
          id="side-navbar-body"
          className="col-span-2 flex flex-col justify-between bg-white py-16"
        >
          <div id="side-navbar-navs" className="flex flex-col gap-y-2">
            <SideNavbarItem
              icon={<HomeIcon className="h-6 w-6" />}
              text="Home"
              href="/"
            />

            <SideNavbarItem
              icon={<CodeBracketIcon className="h-6 w-6" />}
              text="Browse Products"
              href="/products"
            />

            <SideNavbarItem
              icon={<TagIcon className="h-6 w-6" />}
              text="Sell Product"
              href="/products/sell"
            />
          </div>

          <div id="side-navbar-auth-area">
            <div className="flex flex-col gap-y-4">
              {status === "unauthenticated" && (
                <SideNavbarItem text="Join Now" href="/auth" />
              )}

              {status === "authenticated" && (
                <>
                  <SideNavbarItem
                    text={session.user.name as string}
                    href={`/users/${session.user.id}`}
                    icon={
                      session.user.image && (
                        <Image
                          id="user-avatar"
                          src={session.user.image}
                          alt={""}
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full md:max-w-fit"
                        />
                      )
                    }
                  />
                  <SideNavbarItem
                    text="Logout"
                    icon={<ArrowLeftOnRectangleIcon className="h-6 w-6" />}
                    onClick={() => void signOut()}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNavbar;
