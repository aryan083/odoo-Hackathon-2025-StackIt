import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/80">
      <nav className="max-w-[85rem] mx-auto w-full flex md:grid md:grid-cols-3 items-center gap-5 px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center justify-between md:col-span-1">
          <a href="#" aria-label="Preline" className="flex-none rounded-md text-xl font-semibold text-black dark:text-white">
            <svg className="h-8 w-auto text-blue-600" viewBox="0 0 50 50" fill="currentColor">
              <path d="M41.607 20.116c1.117.629 1.5 2.04.88 3.157l-9.826 17.436c-.63 1.118-2.04 1.5-3.158.88l-9.856-5.54-4.897 8.68c-.63 1.118-2.04 1.5-3.158.88l-7.83-4.407a2.333 2.333 0 0 1-.88-3.158L27.356 3.41c.63-1.118 2.04-1.5 3.158-.88l15.73 8.85c1.118.63 1.51 2.04.88 3.158l-5.517 9.578z" />
            </svg>
          </a>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
              aria-label="Toggle navigation"
              onClick={() => setMobileNavOpen(!isMobileNavOpen)}
            >
              <svg
                className={`h-4 w-4 ${isMobileNavOpen ? 'hidden' : 'block'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm14 4H3a1 1 0 100 2h14a1 1 0 100-2z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                className={`h-4 w-4 ${isMobileNavOpen ? 'block' : 'hidden'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="md:col-span-1 hidden md:block">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-400"
              placeholder="Search"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="text-gray-400 dark:text-neutral-400 text-xs">Ctrl K</kbd>
            </div>
          </div>
        </div>

        {/* User Area: Notifications + Avatar */}
        <div className="md:col-span-1 flex justify-end items-center gap-x-2">
          {/* Notification Icon */}
          <button type="button" className="size-9.5 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a6 6 0 00-6 6v4H5a1 1 0 000 2h14a1 1 0 000-2h-1V8a6 6 0 00-6-6zM12 22a2 2 0 002-2H10a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-sm rounded-full"
              aria-expanded={isDropdownOpen}
            >
              <img className="h-8 w-8 rounded-full" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
                <a href="#" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700">Newsletter</a>
                <a href="#" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700">Purchases</a>
                <a href="#" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700">Account Settings</a>
                <div className="my-2 border-t border-gray-100 dark:border-neutral-700" />
                <a href="#" className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700">Log Out</a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isMobileNavOpen && (
        <div className="md:hidden px-4 pb-4">
          <a href="#" className="block py-2 text-sm text-gray-700 dark:text-neutral-200">Home</a>
          <a href="#" className="block py-2 text-sm text-gray-700 dark:text-neutral-200">About</a>
          <a href="#" className="block py-2 text-sm text-gray-700 dark:text-neutral-200">Contact</a>
        </div>
      )}
    </header>
  );
};

export default Header;
