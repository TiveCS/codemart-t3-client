import Link from "next/link";
import { Button } from "../Button";
import Logo from "../Logo";
import AuthArea from "./AuthArea";

const Navbar: React.FC = () => {
  return (
    <nav className="grid max-w-screen grid-flow-col grid-cols-3 px-6 py-6 shadow-md md:px-14">
      <div className="col-span-2 flex flex-row items-center gap-x-16">
        <Logo />

        <div className="hidden md:flex">
          <Link href={"/"}>
            <Button style={"text"}>Home</Button>
          </Link>
          <Link href={"/products/sell"}>
            <Button style={"text"}>Sell Product</Button>
          </Link>
          <Link href={"/products"}>
            <Button style={"text"}>Browse</Button>
          </Link>
        </div>
      </div>
      <AuthArea />
    </nav>
  );
};

export default Navbar;
