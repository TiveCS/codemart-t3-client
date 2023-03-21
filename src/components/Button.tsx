import classNames from "classnames";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  style?: "primary" | "outline" | "text";
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void | unknown | Promise<void> | Promise<unknown>;
}

export function Button({
  children,
  className = "",
  style = "primary",
  type = "button",
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
    >
      {children}
    </button>
  );
}
