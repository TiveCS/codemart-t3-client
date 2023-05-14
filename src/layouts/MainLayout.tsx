import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import Toast from "~/components/Toast";
import useToastsStore from "~/zustand/toastsStore";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const toastsStore = useToastsStore();

  return (
    <div className="h-full min-h-screen">
      <Navbar />
      <main className="my-8 px-6 md:px-8">{children}</main>

      <div className="absolute bottom-16 right-6 hidden min-w-xs md:grid md:grid-flow-row md:gap-y-4 lg:min-w-sm">
        {toastsStore.toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            variant={toast.variant}
            onClickHandler={() => toastsStore.closeToast(toast.id)}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
