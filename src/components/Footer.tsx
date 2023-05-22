const Footer: React.FC = () => {
  return (
    <footer className="bg-codemart-300 py-8 text-gray-50 lg:px-32">
      <div className="mt-12 mb-24 flex flex-col justify-between lg:flex-row">
        <div
          id="footer-actions-container"
          className="flex flex-col items-center justify-evenly gap-y-8 px-16 md:flex-row lg:space-x-48"
        >
          <div
            id="footer-navs"
            className="flex flex-col items-center space-y-2 lg:items-start "
          >
            <h4 className="text-lg font-semibold text-gray-50">CodeMart</h4>
            <a href="#">Browse</a>
            <a href="#">Post Product</a>
            <a href="#">Contact Us</a>
          </div>

          <div
            id="footer-socials"
            className="flex flex-col items-center space-y-2 lg:items-start"
          >
            <h4 className="text-lg font-semibold text-gray-50">Follow Us</h4>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
          </div>
        </div>

        <div
          id="footer-email"
          className="mt-8 flex flex-col items-center space-y-2 md:mt-16 lg:items-start"
        >
          <h4 className="text-lg font-semibold text-gray-50">Email</h4>
          <a href="mailto:support@codemart.com">support@codemart.com</a>
        </div>
      </div>

      <div className="px-6 text-center text-sm font-normal">
        <p>
          Copyright © {new Date().getFullYear()} Rehoukrel Studio and Blue
          Recandy.
        </p>
        <p>Illustration by Undraw.co</p>
      </div>
    </footer>
  );
};

export default Footer;
