"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

// Constants for styling and reusability
const COLORS = {
  primary: "#6faa61",
  primaryHover: "#20B297",
};

// NavLink component for consistent styling and active state
const NavLink = ({ href, children, isMobile = false, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`
        text-[#6faa61] hover:text-[#20B297] text-lg font-medium 
        ${isMobile ? 'py-4 border-b border-gray-200' : 'mx-2'} 
        ${isActive ? 'font-bold' : ''}
      `}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const pathname = usePathname();
  const isServicesPage = pathname === "/services";
  const isCommunityPage = pathname.startsWith("/services/community");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Check if the screen is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close mobile menu when resizing to desktop
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (isMobileMenuOpen && event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    // Apply body scroll lock when menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Services navigation items
  const serviceLinks = [
    { href: "/services", label: "Overview" },
    { href: "/services/chat", label: "Chatbot" },
    { href: "/services/calender", label: "Crop-Calendar" },
    { href: "/services/weather", label: "Weather" },
    { href: "/services/market", label: "Market" },
  ];

  return (
    !isCommunityPage&&<>
      <header className="shadow-xl backdrop-blur-lg z-50 sticky top-0 left-0 right-0 bg-white/80">
        <nav className="flex items-center justify-between px-5 py-1" aria-label="Services navigation">
          <Link href="/" className="py-1" aria-label="Homepage">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="h-10 ml-4 lg:ml-[6vw]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {serviceLinks.map((link) => (
              // Only show Overview on the services main page
              (isServicesPage || link.href !== "/services") && (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              )
            ))}
            
            {/* User profile button */}
            <div className="items-center flex flex-row justify-center ml-1">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10"
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            ref={hamburgerRef}
            className="md:hidden flex flex-col justify-center items-center mr-4 p-2"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            aria-controls="mobile-menu"
          >
            <div
              className={`w-6 h-0.5 bg-[#6faa61] mb-1.5 transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-[#6faa61] mb-1.5 transition-opacity duration-300 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-[#6faa61] transition-transform duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </button>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`fixed top-14 right-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav className="flex flex-col p-4" aria-label="Mobile navigation">
          {serviceLinks.map((link) => (
            <NavLink 
              key={link.href} 
              href={link.href}
              isMobile={true}
              onClick={closeMobileMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay when sidebar is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          aria-hidden="true"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;