/**
 * Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} QR Attendance System. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#aa3bff] dark:hover:text-[#aa3bff] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#aa3bff] dark:hover:text-[#aa3bff] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#aa3bff] dark:hover:text-[#aa3bff] transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;