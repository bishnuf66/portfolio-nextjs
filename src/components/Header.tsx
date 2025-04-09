import React from "react";

const Header = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className=" p-0 sm:px-5 sm:py-4 flex justify-between items-center ">
      <div className="flex flex-col">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Bishnu Bk</h1>
        <h1 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Full Stack Developer</h1>
      </div>
      <div className="flex items-center">
        <label className="inline-flex items-center cursor-pointer ">
          <input
            type="checkbox"
            className="hidden peer"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <div
            className={`relative w-12 h-6 rounded-full overflow-hidden transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
          >
            <div
              className={`absolute left-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-full' : 'translate-x-0'
                }`}
            ></div>
          </div>
          <span
            className={` ml-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900 '
              }`}
          >
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </span>
        </label>
      </div>
    </div>
  );
};

export default Header;
