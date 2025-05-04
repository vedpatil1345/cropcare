"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { 
  SignInButton, 
  SignUpButton, 
  UserButton,
  useUser
} from "@clerk/nextjs";

// Constants for styling and reusability
const COLORS = {
  primary: "#6faa61",
  primaryHover: "#0d6a4a",
  secondary: "#20B297",
};

// MobileMenu Component
const MobileMenu = ({ isOpen, onClose, isSignedIn, menuRef }) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`fixed top-14 right-0 h-[calc(100vh-3rem)] w-2/3 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col justify-between p-6 space-y-6 h-full">
          <nav aria-label="Mobile navigation">
            <Link
              href="/about"
              className={`text-[${COLORS.primary}] hover:text-[${COLORS.secondary}] text-xl font-medium py-2 block`}
              onClick={onClose}
            >
              About us
            </Link>
          </nav>
          <div className="flex flex-col space-y-6">
            {isSignedIn ? (
              <div className="flex items-center space-x-3 border-2 rounded-full border-[#6faa61] bg-white shadow-lg flex-row justify-center ml-4">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-10 w-10"
                    }
                  }}
                />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button
                    className="text-white bg-[#6faa61] border-2 border-[#6faa61] text-xl font-medium py-2 px-4 rounded-full text-center hover:bg-[#0d6a4a] transition-colors duration-200"
                    onClick={onClose}
                  >
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    className="text-[#6faa61] bg-white border-2 border-[#6faa61] text-xl font-medium py-2 px-4 rounded-full text-center hover:bg-gray-100 hover:border-[#0d6a4a] hover:text-[#0d6a4a] transition-colors duration-200"
                    onClick={onClose}
                  >
                    Signup
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        aria-hidden="true"
        onClick={onClose}
      />
    </>
  );
};

// Hamburger Button Component
const HamburgerButton = ({ isOpen, onClick, buttonRef }) => {
  return (
    <button
      ref={buttonRef}
      className="md:hidden flex flex-col justify-center items-center mr-4 p-2"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
      aria-controls="mobile-menu"
    >
      <div
        className={`w-6 h-0.5 bg-[#6faa61] mb-1.5 transition-transform duration-300 ${
          isOpen ? "rotate-45 translate-y-2" : ""
        }`}
      ></div>
      <div
        className={`w-6 h-0.5 bg-[#6faa61] mb-1.5 transition-opacity duration-300 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      ></div>
      <div
        className={`w-6 h-0.5 bg-[#6faa61] transition-transform duration-300 ${
          isOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      ></div>
    </button>
  );
};

// Main Nav Component
const Nav = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const { isSignedIn, user } = useUser();
  const firstFocusableElementRef = useRef(null);

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
      
      // Focus management
      setTimeout(() => {
        if (firstFocusableElementRef.current) {
          firstFocusableElementRef.current.focus();
        }
      }, 100);
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

  // Handle menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header className="shadow-xl backdrop-blur-lg z-50 sticky top-0 left-0 right-0 bg-white/80">
        <nav className="flex items-center justify-between px-5 py-1 mx-auto" aria-label="Main navigation">
          <Link href="/" className="py-1" aria-label="Homepage">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="h-10 ml-4 lg:ml-[6vw]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <Link
              href="/about"
              className="text-[#6faa61] hover:text-[#20B297] text-lg font-medium transition-colors duration-200 mr-3"
            >
              About us
            </Link>
            
            {/* Conditional rendering based on authentication status */}
            {isSignedIn ? (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10"
                  }
                }}
              />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-white bg-[#6faa61] border-2 border-[#6faa61] text-lg font-medium py-[2px] px-3 rounded-full hover:bg-[#0d6a4a] transition-colors duration-200 mr-1">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-[#6faa61] bg-white border-2 border-[#6faa61] text-lg font-medium py-[2px] px-3 rounded-full hover:bg-gray-100 hover:border-[#0d6a4a] hover:text-[#0d6a4a] transition-colors duration-200">
                    Signup
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <HamburgerButton 
            isOpen={isMobileMenuOpen} 
            onClick={toggleMobileMenu} 
            buttonRef={hamburgerRef} 
          />
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        isSignedIn={isSignedIn}
        menuRef={menuRef}
      />
    </>
  );
};

// HomeNav component that conditionally renders Nav
const HomeNav = () => {
  const pathname = usePathname();
  // Only show navigation on pages that aren't the services page
  return !pathname.includes("/services") ? <Nav /> : null;
};

export default HomeNav;