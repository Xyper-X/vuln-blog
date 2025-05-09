import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, FileText, Terminal, Trash2, UserX } from 'lucide-react';

// Command execution vulnerability
const executeCommand = (command: string): string => {
  // In a real application, this would be a server-side call that could execute commands
  // Here we're simulating the vulnerability
  return `Executed: ${command}\nOutput: Command execution simulated for CTF`;
};

const AdminPanel: React.FC = () => {
  const { currentUser, users } = useAuth();
  const navigate = useNavigate();
  const [commandInput, setCommandInput] = useState('');
  const [commandOutput, setCommandOutput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Only allow admin access
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/');
    return null;
  }
  
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    
    // Command injection vulnerability
    const output = executeCommand(commandInput);
    setCommandOutput(output);
    setCommandInput('');
  };
  
  return (
    <div className="admin-panel rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center bg-gray-900 p-6">
        <Shield className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Admin Control Panel</h1>
      </div>
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="text-gray-400 uppercase text-xs font-semibold mb-4 tracking-wider">
            Main Menu
          </div>
          
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center py-2 px-4 rounded transition ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Shield className="h-5 w-5 mr-2" />
                <span>Dashboard</span>
              </button>
            </li>
            
            <li>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center py-2 px-4 rounded transition ${
                  activeTab === 'users' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                <span>Manage Users</span>
              </button>
            </li>
            
            <li>
              <button
                onClick={() => setActiveTab('posts')}
                className={`w-full flex items-center py-2 px-4 rounded transition ${
                  activeTab === 'posts' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                <span>Manage Posts</span>
              </button>
            </li>
            
            <li>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`w-full flex items-center py-2 px-4 rounded transition ${
                  activeTab === 'terminal' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Terminal className="h-5 w-5 mr-2" />
                <span>System Terminal</span>
              </button>
            </li>
          </ul>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 p-8 bg-gray-700 text-white">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">System Stats</h3>
                  <p className="mb-2">Total Users: {users.length}</p>
                  <p className="mb-2">Admin Users: {users.filter(u => u.isAdmin).length}</p>
                  <p>Regular Users: {users.filter(u => !u.isAdmin).length}</p>
                  <div className="mt-4 p-4 bg-yellow-900 bg-opacity-50 rounded">
                    <p className="text-yellow-300 text-sm">
                      Warning: Several security vulnerabilities detected in system. See security tab for details.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="p-2 bg-gray-700 rounded">User admin logged in at 09:15</li>
                    <li className="p-2 bg-gray-700 rounded">New post created by user2 at 08:30</li>
                    <li className="p-2 bg-gray-700 rounded">New user registered: user3 at 07:45</li>
                    <li className="p-2 bg-gray-700 rounded">System backup completed at 00:00</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Manage Users</h2>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Password
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.password}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.isAdmin ? 'Yes' : 'No'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            className="text-red-500 hover:text-red-300 flex items-center"
                            disabled={user.id === currentUser.id}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-red-900 bg-opacity-50 rounded">
                <p className="text-red-300 text-sm">
                  Security Risk: User passwords are stored in plain text and are visible in the admin panel.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'posts' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Manage Posts</h2>
              <p className="text-gray-300 mb-4">
                Post management functionality is under development.
              </p>
              <div className="mt-4 p-4 bg-blue-900 bg-opacity-50 rounded">
                <p className="text-blue-300 text-sm">
                  Coming Soon: Post moderation features will be available in the next update.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'terminal' && (
            <div>
              <h2 className="text-xl font-bold mb-6">System Terminal</h2>
              <p className="mb-4 text-gray-300">
                Execute system commands (simulated for CTF)
              </p>
              
              <form onSubmit={handleCommandSubmit} className="mb-4">
                <div className="flex">
                  <span className="bg-black text-green-500 px-3 py-2">admin@vulnblog:~$</span>
                  <input
                    type="text"
                    className="vulnerable-input flex-1 bg-black text-green-500 px-2 py-2 focus:outline-none"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Enter command..."
                  />
                </div>
                <div className="mt-2">
                  <button
                    type="submit"
                    className="admin-action-button px-4 py-2 rounded"
                  >
                    Execute
                  </button>
                </div>
              </form>
              
              {commandOutput && (
                <div className="bg-black p-4 rounded font-mono text-green-500">
                  <pre>{commandOutput}</pre>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-red-900 bg-opacity-50 rounded">
                <p className="text-red-300 text-sm">
                  Critical Vulnerability: System command execution is enabled and might allow command injection attacks.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;