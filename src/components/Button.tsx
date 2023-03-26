import classNames from "classnames";
import LoadingSpinner from "./Images/LoadingSpinner";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  style?: "primary" | "outline" | "text";
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void | unknown | Promise<void> | Promise<unknown>;
}

export function Button({
  children,
  className = "",
  style = "primary",
  type = "button",
  isLoading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  const classes = classNames({
    "btn-primary": style === "primary",
    "btn-outline": style === "outline",
    "btn-text": style === "text",
  });

  return (
    <button
      type={type}
      className={`${className} btn ${classes}`}
      onClick={onClick}
      disabled={disabled || isLoading === true}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
}
