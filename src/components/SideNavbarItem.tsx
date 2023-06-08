import Link from "next/link";
import { useRouter } from "next/router";

interface SideNavbarItemProps {
  icon?: React.ReactNode;
  text: string;
  href?: string;
  onClick?: () => void;
}

const SideNavbarItem: React.FC<SideNavbarItemProps> = ({
  text,
  icon,
  href,
  onClick,
}) => {
  const router = useRouter();
  const isCurrentPage = router.pathname === href;

  return (
    <Link href={href ?? "#"} onClick={onClick}>
      <div
        className={`group flex w-full flex-row items-center gap-x-4 py-2.5 px-4 group-hover:text-codemart-600 group-focus:bg-codemart-50 group-focus:text-codemart-600 ${
          isCurrentPage ? "bg-codemart-50 text-codemart-600" : "text-gray-500"
        }`}
      >
        <span>{icon}</span>
        <p className="text-left font-medium">{text}</p>
      </div>
    </Link>
  );
};

export default SideNavbarItem;
