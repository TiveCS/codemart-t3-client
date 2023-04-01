import { nanoid } from "nanoid";
import { create } from "zustand";
import { type ToastData } from "~/types";

type NewToast = {
  message: string;
  variant: "normal" | "success" | "danger";
};

interface ToastListState {
  toasts: Array<ToastData>;
  addToast: (newToast: NewToast) => void;
  closeToast: (key: React.Key) => void;
}

const useToastsStore = create<ToastListState>()((set) => ({
  toasts: [],
  addToast: (newToast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: `toast-${nanoid(3)}`, ...newToast }],
    })),
  closeToast: (key) =>
    set((state) => {
      const list = state.toasts;
      const newList = list.filter((toast) => toast.id !== key);

      return {
        toasts: newList,
      };
    }),
}));

export default useToastsStore;
