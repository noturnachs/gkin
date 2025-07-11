const TaskCard = ({ task, darkMode }) => {
  const statusColors = {
    // Light mode colors
    light: {
      'concept': 'bg-amber-50 border-amber-200 text-amber-800',
      'review': 'bg-orange-50 border-orange-200 text-orange-800',
      'updated': 'bg-blue-50 border-blue-200 text-blue-800',
      'final': 'bg-emerald-50 border-emerald-200 text-emerald-800',
      'translated': 'bg-purple-50 border-purple-200 text-purple-800',
      'beamed': 'bg-pink-50 border-pink-200 text-pink-800',
      'completed': 'bg-gray-50 border-gray-200 text-gray-800'
    },
    // Dark mode colors - Telegram-like navy blue theme
    dark: {
      'concept': 'bg-[#2b3f52] border-amber-700 text-amber-300',
      'review': 'bg-[#2b3f52] border-orange-700 text-orange-300',
      'updated': 'bg-[#2b3f52] border-blue-700 text-blue-300',
      'final': 'bg-[#2b3f52] border-emerald-700 text-emerald-300',
      'translated': 'bg-[#2b3f52] border-purple-700 text-purple-300',
      'beamed': 'bg-[#2b3f52] border-pink-700 text-pink-300',
      'completed': 'bg-[#2b3f52] border-gray-600 text-gray-300'
    }
  };
  
  const statusBadgeColors = {
    // Light mode badge colors
    light: {
      'concept': 'bg-amber-100 text-amber-800',
      'review': 'bg-orange-100 text-orange-800',
      'updated': 'bg-blue-100 text-blue-800',
      'final': 'bg-emerald-100 text-emerald-800',
      'translated': 'bg-purple-100 text-purple-800',
      'beamed': 'bg-pink-100 text-pink-800',
      'completed': 'bg-gray-100 text-gray-800'
    },
    // Dark mode badge colors
    dark: {
      'concept': 'bg-amber-900 text-amber-200',
      'review': 'bg-orange-900 text-orange-200',
      'updated': 'bg-blue-900 text-blue-200',
      'final': 'bg-emerald-900 text-emerald-200',
      'translated': 'bg-purple-900 text-purple-200',
      'beamed': 'bg-pink-900 text-pink-200',
      'completed': 'bg-gray-700 text-gray-200'
    }
  };

  const colorMode = darkMode ? 'dark' : 'light';
  const cardBg = darkMode ? 'bg-[#1e2c3a]' : 'bg-white';

  return (
    <div className={`p-4 rounded-lg border ${statusColors[colorMode][task.status].split(' ')[1]} ${cardBg} mb-3 shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadgeColors[colorMode][task.status]}`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </div>
      
      <div className="mb-3">
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{task.description}</p>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Due:</span>
          <span className={`ml-1 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{task.date}</span>
        </div>
        
        <div className="flex items-center">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Assigned to:</span>
          <span className={`ml-1 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{task.assignedTo}</span>
        </div>
      </div>
      
      <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex justify-end space-x-2`}>
        <button className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-[#2b3f52]' : 'hover:bg-gray-100'}`}>
          <svg className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-[#2b3f52]' : 'hover:bg-gray-100'}`}>
          <svg className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </button>
        <button className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-[#2b3f52]' : 'hover:bg-gray-100'}`}>
          <svg className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;