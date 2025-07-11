import TaskCard from './TaskCard';
import { useState } from 'react';

const TaskBoard = ({ activeRole, activeTab, darkMode }) => {
  const [currentWeek, setCurrentWeek] = useState({
    date: 'November 12, 2023',
    title: 'Sunday Service',
    status: 'concept',
    currentOwner: 'Liturgy Maker',
    nextStep: 'Send to Pastor',
    documentLink: '#',
    history: [
      { date: 'Nov 5', action: 'Document created', user: 'Liturgy Maker' },
      { date: 'Nov 7', action: 'Initial songs selected', user: 'Liturgy Maker' }
    ]
  });

  // Process steps in order - updated to match the specific workflow
  const processSteps = [
    { 
      id: 'concept', 
      title: 'Concept Document', 
      role: 'liturgy', 
      description: 'Liturgy maker creates initial document with proposed songs' 
    },
    { 
      id: 'review', 
      title: 'Pastor Review', 
      role: 'pastor', 
      description: 'Pastor reviews songs and provides sermon details' 
    },
    { 
      id: 'updated', 
      title: 'Document Updated', 
      role: 'liturgy', 
      description: 'Liturgy maker updates with pastor input and sermon text' 
    },
    { 
      id: 'final', 
      title: 'Final Document', 
      role: 'liturgy', 
      description: 'Document finalized with all songs and sermon content' 
    },
    { 
      id: 'translated', 
      title: 'Translation', 
      role: 'translation', 
      description: 'Sermon and content translated to other languages' 
    },
    { 
      id: 'beamed', 
      title: 'Beamer Preparation', 
      role: 'beamer', 
      description: 'Final songs added to presentation slides' 
    },
    { 
      id: 'completed', 
      title: 'Completed', 
      role: 'all', 
      description: 'Process completed and ready for service' 
    }
  ];

  // Filter steps based on active role
  const filteredSteps = activeRole === 'all' 
    ? processSteps 
    : processSteps.filter(step => step.role === activeRole || step.role === 'all');

  // Document details based on current status
  const getDocumentDetails = (status) => {
    switch(status) {
      case 'concept':
        return {
          title: 'Initial Concept Document',
          content: [
            { type: 'section', title: 'Opening Songs', items: ['Amazing Grace', 'How Great Thou Art'] },
            { type: 'section', title: 'Worship Songs', items: ['To be determined'] },
            { type: 'section', title: 'Closing Songs', items: ['To be determined'] },
            { type: 'note', text: 'Awaiting pastor review and sermon details' }
          ]
        };
      case 'review':
        return {
          title: 'Pastor Review',
          content: [
            { type: 'section', title: 'Opening Songs', items: ['Amazing Grace', 'How Great Thou Art'] },
            { type: 'section', title: 'Worship Songs', items: ['To be determined'] },
            { type: 'section', title: 'Closing Songs', items: ['To be determined'] },
            { type: 'sermon', title: 'Sermon: "Faith in Action"', text: 'Sermon details added by pastor...' },
            { type: 'note', text: 'Pastor has added sermon details and suggested song changes' }
          ]
        };
      case 'updated':
        return {
          title: 'Updated Document',
          content: [
            { type: 'section', title: 'Opening Songs', items: ['Amazing Grace', 'How Great Thou Art'] },
            { type: 'section', title: 'Worship Songs', items: ['10,000 Reasons', 'Cornerstone'] },
            { type: 'section', title: 'Closing Songs', items: ['In Christ Alone'] },
            { type: 'sermon', title: 'Sermon: "Faith in Action"', text: 'Sermon details added by pastor...' },
            { type: 'note', text: 'Updated with pastor suggestions and finalized song selections' }
          ]
        };
      case 'final':
        return {
          title: 'Final Document',
          content: [
            { type: 'section', title: 'Opening Songs', items: ['Amazing Grace', 'How Great Thou Art'] },
            { type: 'section', title: 'Worship Songs', items: ['10,000 Reasons', 'Cornerstone'] },
            { type: 'section', title: 'Closing Songs', items: ['In Christ Alone'] },
            { type: 'sermon', title: 'Sermon: "Faith in Action"', text: 'Full sermon text included for translation...' },
            { type: 'note', text: 'Final document ready for translation' }
          ]
        };
      case 'translated':
        return {
          title: 'Translated Document',
          content: [
            { type: 'section', title: 'Opening Songs', items: ['Amazing Grace', 'How Great Thou Art'] },
            { type: 'section', title: 'Worship Songs', items: ['10,000 Reasons', 'Cornerstone'] },
            { type: 'section', title: 'Closing Songs', items: ['In Christ Alone'] },
            { type: 'sermon', title: 'Sermon: "Faith in Action"', text: 'Sermon translated to required languages' },
            { type: 'note', text: 'Translation completed, ready for beamer team' }
          ]
        };
      default:
        return {
          title: 'Document',
          content: [
            { type: 'note', text: 'Document details' }
          ]
        };
    }
  };

  const documentDetails = getDocumentDetails(currentWeek.status);

  return (
    <div className="space-y-8">
      {/* Current Week Overview */}
      <div className={`rounded-lg overflow-hidden shadow-sm border ${
        darkMode ? 'bg-[#1e2c3a] border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Current Week: {currentWeek.date} - {currentWeek.title}
            </h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              darkMode 
                ? 'bg-blue-900 text-blue-200' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {currentWeek.status.charAt(0).toUpperCase() + currentWeek.status.slice(1)} Stage
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className={`mb-6 p-4 rounded-lg border ${
                darkMode ? 'bg-[#2b3f52] border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Current Status
                </h3>
                <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex justify-between">
                    <span>Current Owner:</span>
                    <span className="font-medium">{currentWeek.currentOwner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Action:</span>
                    <span className="font-medium">{currentWeek.nextStep}</span>
                  </div>
                  <div className="mt-4">
                    <a 
                      href={currentWeek.documentLink}
                      className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                        darkMode 
                          ? 'bg-blue-800 text-white border-blue-700 hover:bg-blue-700' 
                          : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Document
                    </a>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                darkMode ? 'bg-[#2b3f52] border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Activity History
                </h3>
                <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {currentWeek.history.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <span className="text-xs">{item.date}</span>
                        </div>
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.action}</p>
                        <p className="text-sm">{item.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className={`p-4 rounded-lg border ${
                darkMode ? 'bg-[#2b3f52] border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {documentDetails.title}
                </h3>
                <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {documentDetails.content.map((item, index) => (
                    <div key={index} className="space-y-2">
                      {item.type === 'section' && (
                        <>
                          <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {item.title}
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {item.items.map((song, idx) => (
                              <li key={idx}>{song}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      {item.type === 'sermon' && (
                        <>
                          <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {item.title}
                          </h4>
                          <p className="text-sm italic">{item.text}</p>
                        </>
                      )}
                      {item.type === 'note' && (
                        <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`mt-6 p-4 rounded-lg border ${
                darkMode ? 'bg-[#2b3f52] border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`text-sm font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Process Flow
                </h3>
                <div className="space-y-4">
                  {processSteps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-start ${index < processSteps.length - 1 ? 'pb-4' : ''}`}
                    >
                      <div className="mr-3 flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          step.id === currentWeek.status
                            ? darkMode ? 'bg-blue-700 text-blue-100' : 'bg-blue-500 text-white'
                            : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        {index < processSteps.length - 1 && (
                          <div className={`h-full w-0.5 ml-3.5 mt-1 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          step.id === currentWeek.status
                            ? darkMode ? 'text-blue-400' : 'text-blue-600'
                            : darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {step.title}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {step.description}
                        </p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Assigned to: {step.role.charAt(0).toUpperCase() + step.role.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between">
            <div>
              <button className={`px-4 py-2 rounded-md text-sm font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}>
                View All Documents
              </button>
            </div>
            <div>
              <button className={`px-4 py-2 rounded-md text-sm font-medium ${
                darkMode 
                  ? 'bg-blue-700 text-white hover:bg-blue-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {currentWeek.status === 'concept' ? 'Send to Pastor' : 
                 currentWeek.status === 'review' ? 'Update Document' :
                 currentWeek.status === 'updated' ? 'Finalize Document & Add Sermon' :
                 currentWeek.status === 'final' ? 'Send to Translation' :
                 currentWeek.status === 'translated' ? 'Send to Beamer Team' :
                 currentWeek.status === 'beamed' ? 'Mark as Complete' : 'View Details'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Role-specific Tasks */}
      {activeRole !== 'all' && (
        <div className={`rounded-lg overflow-hidden shadow-sm border ${
          darkMode ? 'bg-[#1e2c3a] border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Your Tasks
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {activeRole === 'liturgy' ? (
                <>
                  <div className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-[#2b3f52] border-gray-700 border-l-4 border-l-amber-500' : 'bg-amber-50 border-amber-200 border-l-4 border-l-amber-500'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          Create concept document for November 12
                        </h3>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Select initial songs and create document structure
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Due Today
                      </span>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className={`px-3 py-1.5 rounded text-sm font-medium ${
                        darkMode 
                          ? 'bg-blue-700 text-white hover:bg-blue-600' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
                        Open Document
                      </button>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-[#2b3f52] border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          Start planning for November 19
                        </h3>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Begin selecting songs for next week's service
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        Upcoming
                      </span>
                    </div>
                  </div>
                </>
              ) : activeRole === 'pastor' ? (
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-[#2b3f52] border-gray-700 border-l-4 border-l-orange-500' : 'bg-orange-50 border-orange-200 border-l-4 border-l-orange-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Review liturgy document for November 12
                      </h3>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Review songs and add sermon details
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
                    }`}>
                      Pending Review
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className={`px-3 py-1.5 rounded text-sm font-medium ${
                      darkMode 
                        ? 'bg-blue-700 text-white hover:bg-blue-600' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      Review Document
                    </button>
                  </div>
                </div>
              ) : activeRole === 'translation' ? (
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-500'
                }`}>
                  <p>No pending translation tasks</p>
                </div>
              ) : activeRole === 'beamer' ? (
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-500'
                }`}>
                  <p>No pending beamer tasks</p>
                </div>
              ) : (
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-500'
                }`}>
                  <p>No pending tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard; 