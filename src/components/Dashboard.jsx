import { useState } from 'react';

const Dashboard = ({ activeRole, activeTab, darkMode }) => {
  // Current document workflow state
  const [currentDocument, setCurrentDocument] = useState({
    id: 1,
    title: 'Sunday Service - November 12, 2023',
    status: 'concept',
    currentRole: 'liturgy',
    dueDate: '2023-11-07',
    createdAt: '2023-11-05',
    updatedAt: '2023-11-05',
    content: {
      openingSongs: ['Amazing Grace', 'How Great Thou Art'],
      worshipSongs: ['To be determined'],
      closingSongs: ['To be determined'],
      sermon: {
        title: 'Faith in Action',
        text: '',
        notes: 'Awaiting pastor input'
      }
    },
    history: [
      { date: 'Nov 5', action: 'Document created', user: 'Liturgy Maker', role: 'liturgy' },
      { date: 'Nov 5', action: 'Initial songs selected', user: 'Liturgy Maker', role: 'liturgy' }
    ]
  });
  
  // Process steps definition
  const processSteps = [
    { 
      id: 'concept', 
      title: 'Concept Document', 
      role: 'liturgy', 
      description: 'Liturgy maker creates initial document with proposed songs',
      actionButton: 'Send to Pastor',
      actionRole: 'liturgy'
    },
    { 
      id: 'review', 
      title: 'Pastor Review', 
      role: 'pastor', 
      description: 'Pastor reviews songs and provides sermon details',
      actionButton: 'Submit Review',
      actionRole: 'pastor'
    },
    { 
      id: 'updated', 
      title: 'Document Updated', 
      role: 'liturgy', 
      description: 'Liturgy maker updates with pastor input and sermon text',
      actionButton: 'Finalize Document',
      actionRole: 'liturgy'
    },
    { 
      id: 'final', 
      title: 'Final Document', 
      role: 'liturgy', 
      description: 'Document finalized with all songs and sermon content',
      actionButton: 'Send to Translation',
      actionRole: 'liturgy'
    },
    { 
      id: 'translated', 
      title: 'Translation', 
      role: 'translation', 
      description: 'Sermon and content translated to other languages',
      actionButton: 'Send to Beamer Team',
      actionRole: 'translation'
    },
    { 
      id: 'beamed', 
      title: 'Beamer Preparation', 
      role: 'beamer', 
      description: 'Final songs added to presentation slides',
      actionButton: 'Mark as Complete',
      actionRole: 'beamer'
    },
    { 
      id: 'completed', 
      title: 'Completed', 
      role: 'all', 
      description: 'Process completed and ready for service',
      actionButton: 'View Details',
      actionRole: 'all'
    }
  ];
  
  // Find current step
  const currentStep = processSteps.find(step => step.id === currentDocument.status);
  
  // Check if current user can take action
  const canTakeAction = activeRole === 'all' || activeRole === currentStep?.actionRole;
  
  // Future weeks data (for future tab)
  const futureWeeks = [
    { date: 'November 19, 2023', title: 'Sunday Service', status: 'not-started' },
    { date: 'November 26, 2023', title: 'Sunday Service', status: 'not-started' },
    { date: 'December 3, 2023', title: 'Advent Service', status: 'not-started' }
  ];
  
  return (
    <div className="space-y-8">
      {/* Status Banner - Visible to all roles */}
      <div className={`rounded-lg overflow-hidden shadow-sm ${
        darkMode ? 'bg-[#2b3f52] border border-gray-700' : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Current Document: {currentDocument.title}
            </h2>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Status: <span className="font-medium">{currentStep?.title}</span> • 
              Currently with: <span className="font-medium">{currentStep?.role.charAt(0).toUpperCase() + currentStep?.role.slice(1)}</span> • 
              Due: <span className="font-medium">{currentDocument.dueDate}</span>
            </p>
          </div>
          
          {canTakeAction && (
            <button className={`mt-3 md:mt-0 px-4 py-2 rounded-md text-sm font-medium ${
              darkMode 
                ? 'bg-blue-700 text-white hover:bg-blue-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}>
              {currentStep?.actionButton}
            </button>
          )}
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      {activeTab === 'current' ? (
        <div className={`rounded-lg overflow-hidden shadow-sm border ${
          darkMode ? 'bg-[#1e2c3a] border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Current Week Workflow
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Document Content */}
              <div>
                <div className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-[#2b3f52] border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Document Content
                  </h3>
                  
                  <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {/* Opening Songs */}
                    <div>
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Opening Songs
                      </h4>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        {currentDocument.content.openingSongs.map((song, idx) => (
                          <li key={idx}>{song}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Worship Songs */}
                    <div>
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Worship Songs
                      </h4>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        {currentDocument.content.worshipSongs.map((song, idx) => (
                          <li key={idx}>{song}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Closing Songs */}
                    <div>
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Closing Songs
                      </h4>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        {currentDocument.content.closingSongs.map((song, idx) => (
                          <li key={idx}>{song}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Sermon */}
                    <div>
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Sermon: {currentDocument.content.sermon.title}
                      </h4>
                      {currentDocument.content.sermon.text ? (
                        <p className="mt-2 italic">{currentDocument.content.sermon.text.substring(0, 100)}...</p>
                      ) : (
                        <p className={`mt-2 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {currentDocument.content.sermon.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a 
                      href="#"
                      className={`inline-flex items-center text-sm font-medium ${
                        darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                      }`}
                    >
                      <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open full document
                    </a>
                  </div>
                </div>
                
                <div className={`mt-6 p-4 rounded-lg border ${
                  darkMode ? 'bg-[#2b3f52] border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Activity History
                  </h3>
                  <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentDocument.history.map((item, index) => (
                      <div key={index} className="flex">
                        <div className="mr-3 flex-shrink-0">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <span className="text-xs">{item.date}</span>
                          </div>
                        </div>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {item.action}
                          </p>
                          <p className="text-sm">
                            {item.user} ({item.role.charAt(0).toUpperCase() + item.role.slice(1)})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Process Flow */}
              <div>
                <div className={`p-4 rounded-lg border ${
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
                            step.id === currentDocument.status
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
                            step.id === currentDocument.status
                              ? darkMode ? 'text-blue-400' : 'text-blue-600'
                              : darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {step.title}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {step.description}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Assigned to: 
                            </span>
                            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                              step.role === 'liturgy' 
                                ? darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                                : step.role === 'pastor'
                                ? darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
                                : step.role === 'translation'
                                ? darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                                : step.role === 'beamer'
                                ? darkMode ? 'bg-pink-900 text-pink-200' : 'bg-pink-100 text-pink-800'
                                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {step.role.charAt(0).toUpperCase() + step.role.slice(1)}
                            </span>
                            
                            {/* Show action button for current step if user has the right role */}
                            {step.id === currentDocument.status && (activeRole === 'all' || activeRole === step.actionRole) && (
                              <button className={`ml-auto text-xs px-2 py-1 rounded ${
                                darkMode 
                                  ? 'bg-blue-700 text-white hover:bg-blue-600' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}>
                                {step.actionButton}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Role-specific Action Card */}
                {activeRole !== 'all' && (
                  <div className={`mt-6 p-4 rounded-lg border ${
                    darkMode 
                      ? activeRole === currentStep?.actionRole
                        ? 'bg-[#2b3f52] border-blue-700 border-l-4' 
                        : 'bg-[#2b3f52] border-gray-700'
                      : activeRole === currentStep?.actionRole
                        ? 'bg-blue-50 border-blue-200 border-l-4' 
                        : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Your Role: {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
                    </h3>
                    
                    {activeRole === currentStep?.actionRole ? (
                      <div>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Action required: This document is waiting for your input.
                        </p>
                        <button className={`px-4 py-2 rounded-md text-sm font-medium ${
                          darkMode 
                            ? 'bg-blue-700 text-white hover:bg-blue-600' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}>
                          {currentStep?.actionButton}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          No action required at this time. The document is currently with the {currentStep?.role} role.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Future Weeks Tab Content
        <div className={`rounded-lg overflow-hidden shadow-sm border ${
          darkMode ? 'bg-[#1e2c3a] border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Upcoming Weeks
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {futureWeeks.map((week, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-[#2b3f52] border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {week.title} - {week.date}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Status: Not started
                      </p>
                    </div>
                    {(activeRole === 'all' || activeRole === 'liturgy') && (
                      <button className={`px-3 py-1.5 rounded text-sm font-medium ${
                        darkMode 
                          ? 'bg-blue-700 text-white hover:bg-blue-600' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
                        Start Document
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 