import TaskCard from './TaskCard';

const TaskBoard = ({ activeRole, activeTab, darkMode }) => {
  // Mock data - in a real app this would come from your backend
  const tasks = [
    {
      id: 1,
      title: 'Sunday Service Liturgy',
      description: 'Create concept document for upcoming Sunday service',
      status: 'concept',
      date: '2023-11-05',
      assignedTo: 'Liturgy Maker',
      role: 'liturgy'
    },
    {
      id: 2,
      title: 'Midweek Service Liturgy',
      description: 'Pastor review needed for midweek service document',
      status: 'review',
      date: '2023-11-08',
      assignedTo: 'Pastor',
      role: 'pastor'
    },
    {
      id: 3,
      title: 'Youth Service Liturgy',
      description: 'Update document with Pastor comments',
      status: 'updated',
      date: '2023-11-12',
      assignedTo: 'Liturgy Maker',
      role: 'liturgy'
    },
    {
      id: 4,
      title: 'Special Event Liturgy',
      description: 'Final document ready for translation',
      status: 'final',
      date: '2023-11-15',
      assignedTo: 'Translation Team',
      role: 'translation'
    },
    {
      id: 5,
      title: 'Christmas Service',
      description: 'Translated document ready for beamer team',
      status: 'translated',
      date: '2023-12-25',
      assignedTo: 'Beamer Team',
      role: 'beamer'
    },
    {
      id: 6,
      title: 'New Year Service',
      description: 'Beamer presentation completed',
      status: 'beamed',
      date: '2024-01-01',
      assignedTo: 'Music Team',
      role: 'music'
    }
  ];

  // Filter tasks based on active role and tab
  const filteredTasks = tasks.filter(task => {
    const roleMatch = activeRole === 'all' || task.role === activeRole;
    // This is just a mockup - in a real app you'd have proper date logic
    const tabMatch = activeTab === 'current' ? 
      new Date(task.date) <= new Date('2023-11-15') : 
      new Date(task.date) > new Date('2023-11-15');
    
    return roleMatch && tabMatch;
  });

  // Group tasks by status
  const columns = {
    concept: { title: 'Concept', tasks: [] },
    review: { title: 'Review', tasks: [] },
    updated: { title: 'Updated', tasks: [] },
    final: { title: 'Final', tasks: [] },
    translated: { title: 'Translated', tasks: [] },
    beamed: { title: 'Beamed', tasks: [] },
    completed: { title: 'Completed', tasks: [] }
  };

  filteredTasks.forEach(task => {
    if (columns[task.status]) {
      columns[task.status].tasks.push(task);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Object.entries(columns).map(([status, column]) => (
        <div 
          key={status} 
          className={`${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          } rounded-lg overflow-hidden shadow-sm border`}
        >
          <div className={`${
            darkMode 
              ? 'bg-[#1e2c3a] border-gray-700' 
              : 'bg-white border-gray-200'
          } px-4 py-3 border-b`}>
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {column.title}
            </h3>
          </div>
          <div className="p-3 max-h-[calc(100vh-240px)] overflow-y-auto">
            {column.tasks.length > 0 ? (
              column.tasks.map(task => (
                <TaskCard key={task.id} task={task} darkMode={darkMode} />
              ))
            ) : (
              <div className={`flex items-center justify-center h-20 border-2 border-dashed ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } rounded-lg`}>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No tasks
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard; 