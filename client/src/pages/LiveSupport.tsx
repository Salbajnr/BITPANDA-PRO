import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircleIcon, SendIcon, PaperclipIcon, UserIcon,
  ClockIcon, CheckCircleIcon, AlertCircleIcon, StarIcon,
  PhoneIcon, VideoIcon, MailIcon, HelpCircleIcon
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  messageType: string;
  attachmentUrl?: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  userId: string;
  agentId?: string;
  agentName?: string;
  status: 'waiting' | 'active' | 'ended';
  subject?: string;
  startedAt: string;
  endedAt?: string;
  rating?: number;
  feedback?: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

export default function LiveSupport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets'>('chat');
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatSubject, setChatSubject] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // New ticket form
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  const { data: activeSession, isLoading: sessionLoading } = useQuery<ChatSession>({
    queryKey: ["/api/support/chat/active"],
    retry: false,
    enabled: !!user && activeTab === 'chat',
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/support/chat/messages", activeSession?.id],
    retry: false,
    enabled: !!activeSession?.id,
    refetchInterval: 2000, // Poll every 2 seconds for new messages
  });

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support/tickets"],
    retry: false,
    enabled: !!user && activeTab === 'tickets',
  });

  const startChatMutation = useMutation({
    mutationFn: (subject: string) =>
      apiRequest('/api/support/chat/start', { 
        method: 'POST', 
        body: { subject } 
      }),
    onSuccess: () => {
      toast({
        title: "Chat started",
        description: "You've been connected to our support team",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/support/chat/active"] });
      setChatSubject("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start chat",
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) =>
      apiRequest('/api/support/chat/message', { 
        method: 'POST', 
        body: { 
          sessionId: activeSession?.id,
          message 
        } 
      }),
    onSuccess: () => {
      setCurrentMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/support/chat/messages", activeSession?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const endChatMutation = useMutation({
    mutationFn: () =>
      apiRequest('/api/support/chat/end', { 
        method: 'POST', 
        body: { sessionId: activeSession?.id } 
      }),
    onSuccess: () => {
      toast({
        title: "Chat ended",
        description: "Thank you for contacting support",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/support/chat/active"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to end chat",
        variant: "destructive",
      });
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: (ticket: typeof ticketForm) =>
      apiRequest('/api/support/tickets', { 
        method: 'POST', 
        body: ticket 
      }),
    onSuccess: () => {
      toast({
        title: "Ticket created",
        description: "Your support ticket has been created successfully",
      });
      setTicketForm({ title: '', description: '', category: 'general', priority: 'medium' });
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create ticket",
        variant: "destructive",
      });
    },
  });

  const rateChatMutation = useMutation({
    mutationFn: (data: { sessionId: string; rating: number; feedback?: string }) =>
      apiRequest('/api/support/chat/rate', { 
        method: 'POST', 
        body: data 
      }),
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/support/chat/active"] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = () => {
    if (!chatSubject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter a subject for your chat",
        variant: "destructive",
      });
      return;
    }
    startChatMutation.mutate(chatSubject);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    sendMessageMutation.mutate(currentMessage);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.title.trim() || !ticketForm.description.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createTicketMutation.mutate(ticketForm);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      waiting: "secondary",
      active: "default",
      ended: "outline",
      open: "secondary",
      in_progress: "default",
      resolved: "outline",
      closed: "outline"
    };
    
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-green-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (sessionLoading || messagesLoading || ticketsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Live Support
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Get instant help from our support team
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 'chat' ? 'default' : 'outline'}
            onClick={() => setActiveTab('chat')}
            data-testid="tab-chat"
          >
            <MessageCircleIcon className="h-4 w-4 mr-2" />
            Live Chat
          </Button>
          <Button
            variant={activeTab === 'tickets' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tickets')}
            data-testid="tab-tickets"
          >
            <HelpCircleIcon className="h-4 w-4 mr-2" />
            Support Tickets
          </Button>
        </div>
      </div>

      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircleIcon className="h-5 w-5" />
                    {activeSession ? 'Live Support Chat' : 'Start New Chat'}
                  </CardTitle>
                  {activeSession && (
                    <div className="flex items-center gap-2">
                      {getStatusBadge(activeSession.status)}
                      {activeSession.agentName && (
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          with {activeSession.agentName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {!activeSession ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4 max-w-md">
                      <MessageCircleIcon className="h-16 w-16 mx-auto text-slate-400" />
                      <h3 className="text-lg font-semibold">Start a Live Chat</h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Get instant help from our support team. Available 24/7.
                      </p>
                      
                      <div className="space-y-3">
                        <Input
                          placeholder="What can we help you with?"
                          value={chatSubject}
                          onChange={(e) => setChatSubject(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                          data-testid="input-chat-subject"
                        />
                        <Button 
                          onClick={handleStartChat}
                          disabled={startChatMutation.isPending || !chatSubject.trim()}
                          className="w-full"
                          data-testid="button-start-chat"
                        >
                          {startChatMutation.isPending ? "Starting..." : "Start Chat"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      {activeSession.status === 'waiting' && (
                        <div className="text-center text-slate-600 dark:text-slate-400 py-8">
                          <ClockIcon className="h-8 w-8 mx-auto mb-2" />
                          <p>Waiting for an agent to join...</p>
                          <p className="text-sm">Average wait time: 2-3 minutes</p>
                        </div>
                      )}

                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === user?.id
                              ? 'bg-primary text-white'
                              : 'bg-white dark:bg-slate-700 border'
                          }`}>
                            {message.senderId !== user?.id && (
                              <div className="flex items-center gap-2 mb-1">
                                <UserIcon className="h-4 w-4" />
                                <span className="text-xs font-medium">
                                  {message.senderName} ({message.senderRole})
                                </span>
                              </div>
                            )}
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white dark:bg-slate-700 border rounded-lg p-3">
                            <div className="flex items-center space-x-1">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                              <span className="text-xs text-slate-500 ml-2">Agent is typing...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    {activeSession.status === 'active' && (
                      <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
                        <Input
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          placeholder="Type your message..."
                          disabled={sendMessageMutation.isPending}
                          data-testid="input-message"
                        />
                        <Button 
                          type="submit" 
                          disabled={sendMessageMutation.isPending || !currentMessage.trim()}
                          data-testid="button-send-message"
                        >
                          <SendIcon className="h-4 w-4" />
                        </Button>
                      </form>
                    )}

                    {/* Chat Controls */}
                    {activeSession.status !== 'ended' && (
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" disabled>
                            <PaperclipIcon className="h-4 w-4 mr-2" />
                            Attach File
                          </Button>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => endChatMutation.mutate()}
                          disabled={endChatMutation.isPending}
                          data-testid="button-end-chat"
                        >
                          End Chat
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium">24/7 Live Support</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Always available</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Average response: &lt; 2 minutes</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other Ways to Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">support@bitpanda-pro.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">1-800-CRYPTO-1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Ticket */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Title *</label>
                    <Input
                      value={ticketForm.title}
                      onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                      placeholder="Brief description of your issue"
                      data-testid="input-ticket-title"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      data-testid="select-ticket-category"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="account">Account</option>
                      <option value="trading">Trading</option>
                      <option value="kyc">KYC Verification</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Priority</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      data-testid="select-ticket-priority"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Description *</label>
                    <Textarea
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      placeholder="Detailed description of your issue"
                      rows={4}
                      data-testid="textarea-ticket-description"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createTicketMutation.isPending}
                    data-testid="button-create-ticket"
                  >
                    {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Ticket List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <HelpCircleIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No support tickets found</p>
                    <p className="text-sm">Create a ticket to get help with any issues</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        data-testid={`ticket-${ticket.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{ticket.title}</h3>
                              {getStatusBadge(ticket.status)}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {ticket.description.length > 100 
                                ? `${ticket.description.substring(0, 100)}...` 
                                : ticket.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>Category: {ticket.category}</span>
                              <span className={getPriorityColor(ticket.priority)}>
                                Priority: {ticket.priority}
                              </span>
                              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}