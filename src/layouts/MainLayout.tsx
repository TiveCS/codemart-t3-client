import Navbar from "~/components/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-full min-h-screen">
      <Navbar />
      <main className="my-8 px-6 md:px-8">{children}</main>
    </div>
  );
};

export default MainLayout;
