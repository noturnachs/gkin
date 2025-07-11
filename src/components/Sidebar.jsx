const Sidebar = ({ darkMode, activeRole, setActiveRole }) => {
  const roles = [
    { id: 'all', name: 'All Roles', icon: (
      <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: 'liturgy', name: 'Liturgy Maker', icon: (
      <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'pastor', name: 'Pastor', icon: (
      <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    )},
    { id: 'translation', name: 'Translation', icon: (
      <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    )},
    { id: 'beamer', name: 'Beamer', icon: (
      <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'music', name: 'Music Team', icon: (
      <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )}
  ];

  return (
    <div className={`w-64 ${darkMode ? 'bg-[#1e2c3a] border-gray-700' : 'bg-white border-gray-200'} border-r shadow-sm`}>
      <div className="p-6">
        <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Liturgy Flow</h1>
      </div>
      
      <nav className="px-4 pb-6">
        <div className={`text-xs font-semibold uppercase tracking-wider px-3 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          Main
        </div>
        <ul>
          <li className="mb-1">
            <a href="#" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              darkMode 
                ? 'bg-[#2b3f52] text-blue-300' 
                : 'bg-indigo-50 text-indigo-700'
            }`}>
              <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </a>
          </li>
          <li className="mb-1">
            <a href="#" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              darkMode 
                ? 'text-gray-300 hover:bg-[#2b3f52] hover:text-gray-100' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
              <svg className={`mr-3 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </a>
          </li>
          <li className="mb-1">
            <a href="#" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              darkMode 
                ? 'text-gray-300 hover:bg-[#2b3f52] hover:text-gray-100' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
              <svg className={`mr-3 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documents
            </a>
          </li>
        </ul>
        
        <div className={`text-xs font-semibold uppercase tracking-wider px-3 mt-6 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          Roles
        </div>
        <ul>
          {roles.map(role => (
            <li key={role.id} className="mb-1">
              <button 
                onClick={() => setActiveRole(role.id)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeRole === role.id
                    ? darkMode 
                      ? 'bg-[#2b3f52] text-blue-300' 
                      : 'bg-indigo-50 text-indigo-700'
                    : darkMode 
                      ? 'text-gray-300 hover:bg-[#2b3f52] hover:text-gray-100' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {role.icon}
                {role.name}
                {role.id !== 'all' && role.id === 'liturgy' && (
                  <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                  }`}>
                    1
                  </span>
                )}
                {role.id !== 'all' && role.id === 'pastor' && (
                  <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                  }`}>
                    1
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 