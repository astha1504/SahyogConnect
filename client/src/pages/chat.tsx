import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Circle, Image, Paperclip } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  messageType: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  userId: number;
  userName: string;
  userRole: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  organizationName?: string;
}

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock conversations for demo (in real app, this would come from API)
  const conversations: Conversation[] = [
    {
      userId: 1,
      userName: "Bright Future Foundation",
      userRole: "ngo",
      lastMessage: "Thank you for the food donation!",
      timestamp: "2 hours ago",
      unread: true,
      organizationName: "Bright Future Foundation",
    },
    {
      userId: 2,
      userName: "Hunger Relief Initiative",
      userRole: "ngo",
      lastMessage: "Pickup scheduled for tomorrow",
      timestamp: "1 day ago",
      unread: false,
      organizationName: "Hunger Relief Initiative",
    },
    {
      userId: 3,
      userName: "Community Health Alliance",
      userRole: "ngo",
      lastMessage: "Impact report attached",
      timestamp: "3 days ago",
      unread: false,
      organizationName: "Community Health Alliance",
    },
  ];

  // Mock messages for demo
  const mockMessages: Record<number, Message[]> = {
    1: [
      {
        id: 1,
        senderId: 1,
        receiverId: user?.id || 0,
        content: "Hello! Thank you for your food donation. We have successfully received and distributed the meals to 50 families in our community.",
        messageType: "text",
        read: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        senderId: user?.id || 0,
        receiverId: 1,
        content: "That's wonderful to hear! Could you share some photos of the distribution?",
        messageType: "text",
        read: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        senderId: 1,
        receiverId: user?.id || 0,
        content: "Absolutely! Here are some photos from today's distribution:",
        messageType: "text",
        read: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        senderId: user?.id || 0,
        receiverId: 1,
        content: "This makes me so happy! Thank you for the great work you're doing. I'll plan another donation soon.",
        messageType: "text",
        read: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ],
  };

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/messages", selectedConversation],
    enabled: !!selectedConversation,
    initialData: selectedConversation ? mockMessages[selectedConversation] || [] : [],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedConversation) throw new Error("No conversation selected");
      
      const response = await apiRequest("POST", "/api/messages", {
        receiverId: selectedConversation,
        content,
        messageType: "text",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedConversation] });
      setMessageText("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // WebSocket connection
  useEffect(() => {
    if (!user?.id) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      // Authenticate WebSocket connection
      const token = localStorage.getItem("auth_token");
      if (token) {
        websocket.send(JSON.stringify({ type: "auth", token }));
      }
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_message") {
          queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
          toast({
            title: "New Message",
            description: "You have received a new message.",
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [user?.id, queryClient, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    sendMessageMutation.mutate(messageText);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const selectedConversationData = conversations.find(c => c.userId === selectedConversation);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate with NGOs and track your conversations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation === conversation.userId 
                      ? "border-l-4 border-primary bg-blue-50" 
                      : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.userId)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-white font-semibold">
                        {getInitials(conversation.organizationName || conversation.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.organizationName || conversation.userName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                    </div>
                    {conversation.unread && (
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col" style={{ height: "600px" }}>
          {selectedConversationData ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-white font-semibold">
                      {getInitials(selectedConversationData.organizationName || selectedConversationData.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversationData.organizationName || selectedConversationData.userName}
                    </h3>
                    <p className="text-sm text-green-600 flex items-center">
                      <Circle className="w-2 h-2 mr-1 fill-current" />
                      Online
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-xs lg:max-w-md">
                      <div
                        className={`rounded-lg p-3 ${
                          message.senderId === user?.id
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p>{message.content}</p>
                        {message.id === 3 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <img
                              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&h=150&fit=crop"
                              alt="Food distribution"
                              className="rounded w-full h-20 object-cover"
                            />
                            <img
                              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=150&fit=crop"
                              alt="Families receiving food"
                              className="rounded w-full h-20 object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-xs text-gray-500 mt-1 ${
                          message.senderId === user?.id ? "text-right" : "text-left"
                        }`}
                      >
                        {message.senderId === user?.id ? "You" : selectedConversationData.userName} • {" "}
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <Button type="button" variant="outline" size="icon">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon">
                    <Image className="w-4 h-4" />
                  </Button>
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="btn-primary"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
