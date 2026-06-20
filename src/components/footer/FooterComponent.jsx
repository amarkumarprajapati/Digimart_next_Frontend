import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

const SECTIONS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Clothing", href: "/products" },
      { label: "Home", href: "/products" },
      { label: "Beauty", href: "/products" },
      { label: "Accessories", href: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Profile", href: "/my-profile" },
      { label: "Orders", href: "/orders" },
      { label: "Wishlist", href: "/favorites" },
      { label: "Coupons", href: "/coupons" },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <span className="text-xl font-semibold tracking-tight text-ink">
              Digi<span className="text-brand">Mart</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Considered products for everyday life — clothing, home goods, beauty
              and accessories. Fair prices, free returns.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-ink">{section.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="text-sm text-muted">© {year} DigiMart. All rights reserved.</p>
          <div className="flex items-center gap-5 text-sm text-muted">
            <span>Secure checkout</span>
            <span>Free returns</span>
            <span>support@digimart.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
