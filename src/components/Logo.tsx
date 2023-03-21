import Link from "next/link";
import LogoNoText from "./svg/LogoNoText";

const Logo: React.FC = () => {
  return (
    <Link href={"/"}>
      <LogoNoText />
    </Link>
  );
};

export default Logo;
