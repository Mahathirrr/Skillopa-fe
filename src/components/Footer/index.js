import React from "react";
import Link from "next/link";
import { FaInstagram, FaGithub, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-footerBg text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h3 className="font-comedik text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Skillopa
            </h3>
            <p className="text-secondaryText">
              Empowering creative minds through immersive learning experiences.
            </p>
          </div>

          <div>
            <h4 className="font-comedik text-xl mb-6 text-primary">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/courses">
                  <a className="text-secondaryText hover:text-primary transition-colors">
                    Browse Courses
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-secondaryText hover:text-primary transition-colors">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-secondaryText hover:text-primary transition-colors">
                    Contact
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-comedik text-xl mb-6 text-primary">
              Connect with Developer
            </h4>
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/emhaa._"
                target="_blank"
                rel="noreferrer"
                className="text-secondaryText hover:text-primary transition-transform hover:scale-110"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://github.com/Mahathirrr"
                target="_blank"
                rel="noreferrer"
                className="text-secondaryText hover:text-primary transition-transform hover:scale-110"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://wa.me/+6281397181617"
                target="_blank"
                rel="noreferrer"
                className="text-secondaryText hover:text-primary transition-transform hover:scale-110"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-secondaryText">
            © {new Date().getFullYear()} Skillopa. Created with 💜 by{" "}
            <a
              href="https://github.com/Mahathirrr"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
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
