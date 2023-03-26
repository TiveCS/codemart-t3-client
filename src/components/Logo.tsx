import Link from "next/link";
import LogoNoText from "./Images/LogoNoText";

const Logo: React.FC = () => {
  return (
    <Link href={"/"}>
      <LogoNoText />
    </Link>
  );
};

export default Logo;
