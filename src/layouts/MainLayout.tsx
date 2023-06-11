import Script from "next/script";
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
    <>
      <Script
        id="maze-snippet"
        dangerouslySetInnerHTML={{
          __html: `
          (function (m, a, z, e) {
            var s, t;
            try {
              t = m.sessionStorage.getItem('maze-us');
            } catch (err) {}

            if (!t) {
              t = new Date().getTime();
              try {
                m.sessionStorage.setItem('maze-us', t);
              } catch (err) {}
            }

            s = a.createElement('script');
            s.src = z + '?t=' + t + '&apiKey=' + e;
            s.async = true;
            a.getElementsByTagName('head')[0].appendChild(s);
            m.mazeUniversalSnippetApiKey = e;
          })(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'de679ef3-2d5d-46e7-939e-1e4928e0a096');
          `,
        }}
      ></Script>
      <div className="h-full min-h-screen">
        <Navbar />

        <main className="my-8 px-6 md:px-8">{children}</main>

        <div
          id="toast-container"
          className="fixed bottom-6 right-6 hidden min-w-xs md:grid md:grid-flow-row md:gap-y-4 lg:min-w-sm"
        >
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
    </>
  );
};

export default MainLayout;
