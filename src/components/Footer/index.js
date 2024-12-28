import React from "react";
import Link from "next/link";
import { FaInstagram, FaGithub, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-footerBg mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-comedik text-3xl text-primary">Skillopa</h3>
            <p className="text-gray-400 max-w-xs">
              Empowering creative minds through immersive learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-comedik text-xl mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/courses">
                  <a className="text-gray-400 hover:text-primary transition-colors">
                    Browse Courses
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-primary transition-colors">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-primary transition-colors">
                    Contact
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="font-comedik text-xl mb-6 text-white">
              Connect with Developer
            </h4>
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/emhaa._"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-primary transition-all transform hover:scale-110"
              >
                <FaInstagram size={28} />
              </a>
              <a
                href="https://github.com/Mahathirrr"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-primary transition-all transform hover:scale-110"
              >
                <FaGithub size={28} />
              </a>
              <a
                href="https://wa.me/+6281397181617"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-primary transition-all transform hover:scale-110"
              >
                <FaWhatsapp size={28} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Skillopa. Code by{" "}
            <a
              href="https://github.com/Mahathirrr"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primaryLight transition-colors"
            >
              Muhammad Mahathir
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
