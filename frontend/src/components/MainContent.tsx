import React from 'react';

const MainContent: React.FC = () => {
  return (
    <div className="md:py-4 bg-white md:border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <nav className="relative max-w-[85rem] w-full mx-auto md:flex md:items-center md:gap-3 px-4 sm:px-6 lg:px-8">
        <div
          id="hs-secondaru-navbar"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block"
          aria-labelledby="hs-secondaru-navbar-collapse"
        >
          <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center gap-y-0.5 md:gap-y-0 md:gap-x-6">
              {[
                { label: 'Dashboard', iconPath: 'M15 21v-8...z', href: '#', active: true },
                { label: 'Users', iconPath: 'M19 21v-2...z', href: '#' },
                { label: 'Account', iconPath: 'M12 12h...z', href: '#' },
                { label: 'Projects', iconPath: 'M4 22h...z', href: '#' },
                { label: 'Calendar', iconPath: 'M12 12h...z', href: '#' },
                { label: 'Documentation', iconPath: 'M4 22h...z', href: '#' }
              ].map((item, index) => (
                <a
                  key={index}
                  className={`py-2 md:py-0 flex items-center font-medium text-sm ${
                    item.active
                      ? 'text-blue-600 dark:text-blue-500'
                      : 'text-gray-800 hover:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500'
                  }`}
                  href={item.href}
                >
                  {/* Replace <path d="..." /> with actual icons if needed */}
                  <svg className="shrink-0 size-4 me-3 md:me-2 block md:hidden" xmlns="http://www.w3.org/2000/svg">
                    <path d={item.iconPath} />
                  </svg>
                  {item.label}
                </a>
              ))}

              {/* Dropdown menu component can be split out separately if needed */}
              {/* For now keeping static HTML per your structure */}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainContent;
