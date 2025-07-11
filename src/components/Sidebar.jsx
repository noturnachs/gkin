const Sidebar = ({ darkMode }) => {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documents
            </a>
          </li>
        </ul>
        
        <div className={`text-xs font-semibold uppercase tracking-wider px-3 mt-6 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          Teams
        </div>
        <ul>
          <li className="mb-1">
            <a href="#" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              darkMode 
                ? 'text-gray-300 hover:bg-[#2b3f52] hover:text-gray-100' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
              <svg className={`mr-3 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Liturgy Team
            </a>
          </li>
          <li className="mb-1">
            <a href="#" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              darkMode 
                ? 'text-gray-300 hover:bg-[#2b3f52] hover:text-gray-100' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
              <svg className={`mr-3 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              All Teams
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 