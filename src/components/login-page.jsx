import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { FileText, Users, Music, Video, BookOpen } from "lucide-react";

const roles = [
  { 
    id: "liturgy", 
    name: "Liturgy Maker", 
    icon: FileText, 
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Create and manage liturgy documents"
  },
  { 
    id: "pastor", 
    name: "Pastor", 
    icon: BookOpen, 
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Review and approve liturgy content"
  },
  { 
    id: "translation", 
    name: "Translator", 
    icon: Users, 
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Translate liturgy content"
  },
  { 
    id: "beamer", 
    name: "Beamer Team", 
    icon: Video, 
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Create presentation slides"
  },
  { 
    id: "music", 
    name: "Musicians", 
    icon: Music, 
    color: "bg-pink-500",
    textColor: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    description: "Prepare music arrangements"
  }
];

export function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!selectedRole || !username.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = {
        id: Math.floor(Math.random() * 1000),
        username: username,
        role: selectedRole  // Store the entire role object
      };
      
      onLogin(user);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-gray-300 shadow-lg">
        <CardHeader className="text-center border-b border-gray-200 bg-white">
          <CardTitle className="text-2xl font-bold text-gray-900">Liturgy Workflow</CardTitle>
          <CardDescription className="text-gray-600">Sign in to continue</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2 space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((role) => (
                <div 
                  key={role.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all ${
                    selectedRole?.id === role.id 
                      ? `${role.borderColor} ${role.bgColor} border-2` 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className={`w-10 h-10 rounded-full ${role.color} flex items-center justify-center`}>
                    <role.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className={`font-medium ${selectedRole?.id === role.id ? role.textColor : 'text-gray-800'}`}>
                      {role.name}
                    </div>
                    <div className="text-xs text-gray-500">{role.description}</div>
                  </div>
                  {selectedRole?.id === role.id && (
                    <div className="ml-auto">
                      <div className={`w-3 h-3 rounded-full ${role.color}`}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end pt-2 pb-6">
          <Button 
            onClick={handleLogin} 
            disabled={!selectedRole || !username.trim() || isLoading}
            className={`w-full ${
              selectedRole 
                ? selectedRole.id === "liturgy" ? "bg-blue-600 hover:bg-blue-700" 
                : selectedRole.id === "pastor" ? "bg-purple-600 hover:bg-purple-700"
                : selectedRole.id === "translation" ? "bg-green-600 hover:bg-green-700"
                : selectedRole.id === "beamer" ? "bg-orange-600 hover:bg-orange-700"
                : "bg-pink-600 hover:bg-pink-700"
                : "bg-gray-600 hover:bg-gray-700"
            } text-white font-medium`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 