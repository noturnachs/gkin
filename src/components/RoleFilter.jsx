const RoleFilter = ({ activeRole, setActiveRole, darkMode }) => {
  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'liturgy', name: 'Liturgy Maker' },
    { id: 'pastor', name: 'Pastor' },
    { id: 'translation', name: 'Translation' },
    { id: 'beamer', name: 'Beamer' },
    { id: 'music', name: 'Music Team' }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setActiveRole(role.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeRole === role.id
                ? darkMode
                  ? 'bg-[#2b3f52] text-blue-300'
                  : 'bg-indigo-100 text-indigo-700'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {role.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleFilter; 