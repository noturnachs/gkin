import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import TaskBoard from './components/TaskBoard'
import RoleFilter from './components/RoleFilter'

function App() {
  const [activeRole, setActiveRole] = useState('all')
  const [activeTab, setActiveTab] = useState('current')
  const [darkMode, setDarkMode] = useState(false)
  
  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    }
  }, [])
  
  // Update document class and save preference when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }
  
  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900' : ''}`}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Main Dashboard */}
        <main className={`flex-1 overflow-y-auto p-6 ${darkMode ? 'bg-gray-900' : ''}`}>
          {/* Tabs for Current/Future Weeks */}
          <div className={`flex mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              className={`px-5 py-3 text-sm font-medium ${
                activeTab === 'current' 
                  ? darkMode 
                    ? 'border-b-2 border-blue-400 text-blue-400' 
                    : 'border-b-2 border-indigo-500 text-indigo-600'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Current Week
            </button>
            <button 
              className={`px-5 py-3 text-sm font-medium ${
                activeTab === 'future' 
                  ? darkMode 
                    ? 'border-b-2 border-blue-400 text-blue-400' 
                    : 'border-b-2 border-indigo-500 text-indigo-600'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('future')}
            >
              Future Weeks
            </button>
          </div>
          
          {/* Role Filter */}
          <RoleFilter activeRole={activeRole} setActiveRole={setActiveRole} darkMode={darkMode} />
          
          {/* Task Board */}
          <TaskBoard activeRole={activeRole} activeTab={activeTab} darkMode={darkMode} />
        </main>
      </div>
    </div>
  )
}

export default App
