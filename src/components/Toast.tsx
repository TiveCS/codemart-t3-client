import classNames from "classnames";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type ToastProps = {
  isVisible?: boolean;
  onClickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
} & ToastData;

export type ToastData = {
  id: string;
  message: string;
  variant: "normal" | "success" | "danger";
};

const Toast: React.FC<ToastProps> = ({
  message,
  variant = "normal",
  isVisible = true,
  id,
  onClickHandler,
}) => {
  const classes = classNames({
    "toast-normal": variant === "normal",
    "toast-success": variant === "success",
    "toast-danger": variant === "danger",
  });

  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (visible === true) {
      setTimeout(() => {
        setVisible(false);
      }, 4000);
    }
  }, [visible]);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setVisible(false);

    onClickHandler(event);
  };

  if (!visible) return <></>;

  return (
    <div key={id} id={id} role={"alert"} className={`${classes} toast `}>
      <span>{message}</span>

      <button
        id="toast-close"
        className="rounded-md p-0.5"
        onClick={handleClose}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Toast;
