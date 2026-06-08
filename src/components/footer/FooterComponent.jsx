 
import { Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              DigiMart
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
              Premium electronics and latest technology at the best price.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-[#088395] dark:hover:text-[#7AB2B2]">Products</Link></li>
              <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#088395] dark:hover:text-[#7AB2B2]">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[#088395] dark:hover:text-[#7AB2B2]">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@digimart.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +1 234 567 890
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {currentYear} DigiMart. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#088395] dark:hover:text-[#7AB2B2]">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#088395] dark:hover:text-[#7AB2B2]">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#088395] dark:hover:text-[#7AB2B2]">
              <Instagram className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
