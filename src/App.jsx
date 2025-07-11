import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import TaskBoard from './components/TaskBoard'
import RoleFilter from './components/RoleFilter'

function App() {
  const [activeRole, setActiveRole] = useState('all')
  const [activeTab, setActiveTab] = useState('current')
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {/* Main Dashboard */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Tabs for Current/Future Weeks */}
          <div className="flex mb-6 border-b border-gray-200">
            <button 
              className={`px-5 py-3 text-sm font-medium ${activeTab === 'current' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('current')}
            >
              Current Week
            </button>
            <button 
              className={`px-5 py-3 text-sm font-medium ${activeTab === 'future' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('future')}
            >
              Future Weeks
            </button>
          </div>
          
          {/* Role Filter */}
          <RoleFilter activeRole={activeRole} setActiveRole={setActiveRole} />
          
          {/* Task Board */}
          <TaskBoard activeRole={activeRole} activeTab={activeTab} />
        </main>
      </div>
    </div>
  )
}

export default App
