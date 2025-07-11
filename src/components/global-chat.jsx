import { useState, useRef, useEffect } from "react";
import { Send, AtSign, User, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

// Sample user data
const users = [
  { id: 1, name: "John Doe", role: "liturgy", email: "john@example.com", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Jane Smith", role: "pastor", email: "jane@example.com", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Mike Johnson", role: "translation", email: "mike@example.com", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Sarah Williams", role: "beamer", email: "sarah@example.com", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "David Brown", role: "music", email: "david@example.com", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "Lisa Davis", role: "beamer", email: "lisa@example.com", avatar: "https://i.pravatar.cc/150?img=6" },
];

// Sample messages
const initialMessages = [
  {
    id: 1,
    sender: users[0],
    text: "Hi everyone, I've updated the liturgy document for this Sunday.",
    timestamp: "2023-11-10T09:30:00",
    mentions: [],
  },
  {
    id: 2,
    sender: users[1],
    text: "Thanks @liturgy for the update! I'll review it today.",
    timestamp: "2023-11-10T10:15:00",
    mentions: ["liturgy"],
  },
  {
    id: 3,
    sender: users[3],
    text: "@translation can you please translate the new sections by tomorrow?",
    timestamp: "2023-11-10T11:05:00",
    mentions: ["translation"],
  },
];

// Role colors mapping
const roleColors = {
  liturgy: { bg: "bg-blue-500", text: "text-blue-700", light: "bg-blue-100" },
  pastor: { bg: "bg-purple-500", text: "text-purple-700", light: "bg-purple-100" },
  translation: { bg: "bg-green-500", text: "text-green-700", light: "bg-green-100" },
  beamer: { bg: "bg-orange-500", text: "text-orange-700", light: "bg-orange-100" },
  music: { bg: "bg-pink-500", text: "text-pink-700", light: "bg-pink-100" },
};

export function GlobalChat({ currentUser = users[0] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionPosition, setMentionPosition] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change, but only within the chat container
  useEffect(() => {
    if (chatEndRef.current) {
      // Use scrollIntoView with a specific container instead of affecting the whole page
      const chatContainer = chatEndRef.current.parentElement;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Handle input changes and detect @ mentions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    // Check for @ mentions
    const lastAtSymbolIndex = value.lastIndexOf("@");
    if (lastAtSymbolIndex !== -1 && lastAtSymbolIndex > value.lastIndexOf(" ")) {
      setShowMentionSuggestions(true);
      setMentionPosition(lastAtSymbolIndex);
      const searchText = value.substring(lastAtSymbolIndex + 1).toLowerCase();
      setMentionSearch(searchText);

      // Filter suggestions based on roles and names
      const suggestions = [];
      
      // First check for role matches
      const roles = ["liturgy", "pastor", "translation", "beamer", "music"];
      const matchingRoles = roles.filter(role => 
        role.toLowerCase().includes(searchText)
      );
      
      matchingRoles.forEach(role => {
        suggestions.push({ type: "role", value: role });
      });
      
      // Then check for user matches
      const matchingUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchText) ||
        user.role.toLowerCase().includes(searchText)
      );
      
      matchingUsers.forEach(user => {
        suggestions.push({ type: "user", value: user });
      });
      
      setFilteredSuggestions(suggestions);
    } else {
      setShowMentionSuggestions(false);
    }
  };

  // Apply selected mention
  const applyMention = (suggestion) => {
    const beforeMention = newMessage.substring(0, mentionPosition);
    let mentionText = "";
    
    if (suggestion.type === "role") {
      mentionText = `@${suggestion.value} `;
    } else {
      mentionText = `@${suggestion.value.name} `;
    }
    
    const afterMention = newMessage.substring(mentionPosition + mentionSearch.length + 1);
    
    setNewMessage(beforeMention + mentionText + afterMention);
    setShowMentionSuggestions(false);
    inputRef.current.focus();
  };

  // Send message
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    // Extract mentions
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(newMessage)) !== null) {
      mentions.push(match[1].toLowerCase());
    }

    const newMsg = {
      id: messages.length + 1,
      sender: currentUser,
      text: newMessage,
      timestamp: new Date().toISOString(),
      mentions: mentions,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate email notification
    if (mentions.length > 0) {
      console.log("Sending email notifications to:", mentions);
      // In a real app, you would call an API to send emails here
      
      // Show notification for demo purposes
      alert(`Email notifications sent to: ${mentions.join(", ")}`);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for message groups
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Highlight mentions in message text
  const highlightMentions = (text) => {
    return text.split(" ").map((word, index) => {
      if (word.startsWith("@")) {
        const role = word.substring(1).toLowerCase();
        const color = roleColors[role]?.text || "text-blue-600";
        
        return (
          <span key={index}>
            <span className={`${color} font-medium`}>{word}</span>{" "}
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  };

  return (
    <Card className="border border-gray-200 h-[500px] flex flex-col">
      <CardHeader className="border-b border-gray-200 pb-3">
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <AtSign className="w-4 h-4 text-muted-foreground" />
          Team Communication
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Use @role or @name to notify team members
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="p-4 space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {formatDate(dateMessages[0].timestamp)}
                </div>
              </div>
              
              {dateMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex gap-3 ${message.sender.id === currentUser.id ? 'justify-end' : ''}`}
                >
                  {message.sender.id !== currentUser.id && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={message.sender.avatar} 
                        alt={message.sender.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[70%] ${
                      message.sender.id === currentUser.id 
                        ? 'bg-primary text-primary-foreground rounded-t-lg rounded-bl-lg' 
                        : 'bg-gray-100 text-gray-800 rounded-t-lg rounded-br-lg'
                    } p-3`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-medium ${
                        message.sender.id === currentUser.id 
                          ? 'text-primary-foreground opacity-90' 
                          : 'text-gray-600'
                      }`}>
                        {message.sender.id === currentUser.id ? 'You' : message.sender.name}
                        <span className="text-xs ml-1 opacity-70">
                          ({message.sender.role})
                        </span>
                      </span>
                      <span className={`text-xs ${
                        message.sender.id === currentUser.id 
                          ? 'text-primary-foreground opacity-70' 
                          : 'text-gray-500'
                      } flex items-center gap-1`}>
                        <Clock className="w-3 h-3" />
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm break-words">{highlightMentions(message.text)}</p>
                    {message.mentions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {message.mentions.map((mention, index) => {
                          const roleColor = roleColors[mention]?.light || "bg-blue-100";
                          const textColor = roleColors[mention]?.text || "text-blue-700";
                          
                          return (
                            <span 
                              key={index}
                              className={`text-xs px-2 py-0.5 rounded-full ${roleColor} ${textColor}`}
                            >
                              @{mention}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {message.sender.id === currentUser.id && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={message.sender.avatar} 
                        alt={message.sender.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </CardContent>
      
      <div className="p-4 border-t border-gray-200 relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message... Use @ to mention"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            
            {showMentionSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute bottom-full left-0 mb-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredSuggestions.map((suggestion, index) => {
                  if (suggestion.type === "role") {
                    const roleColor = roleColors[suggestion.value]?.bg || "bg-blue-500";
                    
                    return (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => applyMention(suggestion)}
                      >
                        <div className={`w-2 h-2 rounded-full ${roleColor}`}></div>
                        <span className="font-medium">{suggestion.value}</span>
                        <Badge variant="outline" className="ml-auto text-xs bg-gray-100">
                          role
                        </Badge>
                      </div>
                    );
                  } else {
                    const roleColor = roleColors[suggestion.value.role]?.bg || "bg-blue-500";
                    
                    return (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => applyMention(suggestion)}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <img 
                            src={suggestion.value.avatar} 
                            alt={suggestion.value.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{suggestion.value.name}</div>
                          <div className="text-xs flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${roleColor}`}></div>
                            {suggestion.value.role}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
          <Button 
            onClick={sendMessage} 
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
} 