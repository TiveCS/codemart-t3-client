const Footer: React.FC = () => {
  return (
    <footer className="bg-codemart-300 py-8 px-32 text-gray-50">
      <div className="mt-12 mb-24 flex flex-row justify-between pr-24">
        <div className="flex flex-row items-center space-x-48">
          <div className="flex flex-col space-y-2 ">
            <h4 className="text-lg font-semibold text-gray-50">CodeMart</h4>
            <a href="#">Browse</a>
            <a href="#">Post Product</a>
            <a href="#">Contact Us</a>
          </div>

          <div className="flex flex-col space-y-2">
            <h4 className="text-lg font-semibold text-gray-50">Follow Us</h4>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <h4 className="text-lg font-semibold text-gray-50">Email</h4>
          <a href="mailto:support@codemart.com">support@codemart.com</a>
        </div>
      </div>

      <div className="text-center text-sm font-light">
        <p>Copyright © 2022 Rehoukrel Studio and Blue Recandy.</p>
        <p>Illustration by Undraw.co</p>
      </div>
    </footer>
  );
};

export default Footer;
