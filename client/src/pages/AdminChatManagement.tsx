import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircleIcon, SendIcon, UserIcon, ClockIcon,
  CheckCircleIcon, StarIcon, EyeIcon, MessageSquareIcon,
  PaperclipIcon, FileIcon, ImageIcon, DownloadIcon
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Placeholder for a loading card component
const LoadingCard = ({ count, height }: { count: number; height: string }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className={`${height} animate-pulse`}>
          <CardHeader>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              </div>
              <div className="mt-4 h-8 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};


interface ChatSession {
  id: string;
  userId: string;
  agentId?: string;
  agentName?: string;
  status: 'waiting' | 'active' | 'ended';
  subject: string;
  startedAt: string;
  endedAt?: string;
  rating?: number;
  feedback?: string;
  user: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  messageType: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
  createdAt: string;
}

export default function AdminChatManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [activeTab, setActiveTab] = useState<'waiting' | 'active' | 'ended'>('waiting');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch chat sessions by status
  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ["/api/support/chat/admin/sessions", activeTab],
    queryFn: () => apiRequest(`/api/support/chat/admin/sessions?status=${activeTab}`),
    refetchInterval: 5000,
  });

  // Fetch messages for selected session
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/support/chat/messages", selectedSession?.id],
    queryFn: () => apiRequest(`/api/support/chat/messages/${selectedSession?.id}`),
    enabled: !!selectedSession?.id,
    refetchInterval: 2000,
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!selectedSession?.id) return;

    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('💬 Admin Chat WebSocket connected');
      ws.send(JSON.stringify({
        type: 'authenticate',
        userId: user?.id,
        role: 'admin'
      }));

      ws.send(JSON.stringify({
        type: 'join_session',
        sessionId: selectedSession.id,
        userId: user?.id
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'new_message') {
          queryClient.invalidateQueries({ queryKey: ["/api/support/chat/messages", selectedSession.id] });
        } else if (data.type === 'session_status_changed') {
          queryClient.invalidateQueries({ queryKey: ["/api/support/chat/admin/sessions"] });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('💬 Admin Chat WebSocket disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'leave_session'
        }));
        ws.close();
      }
    };
  }, [selectedSession?.id, user?.id, queryClient]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const assignSessionMutation = useMutation({
    mutationFn: (sessionId: string) =>
      apiRequest('/api/support/chat/admin/assign', {
        method: 'POST',
        body: { sessionId }
      }),
    onSuccess: () => {
      toast({
        title: "Session assigned",
        description: "You have been assigned to this chat session",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/support/chat/admin/sessions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign session",
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; attachmentUrl?: string; attachmentName?: string; attachmentSize?: number }) => {
      const response = await apiRequest('/api/support/chat/message', {
        method: 'POST',
        body: {
          sessionId: selectedSession?.id,
          message: data.message,
          attachmentUrl: data.attachmentUrl,
          attachmentName: data.attachmentName,
          attachmentSize: data.attachmentSize,
          messageType: data.attachmentUrl ? 'file' : 'text'
        }
      });

      // Send via WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'send_message',
          sessionId: selectedSession?.id,
          message: data.message,
          attachmentUrl: data.attachmentUrl,
          messageType: data.attachmentUrl ? 'file' : 'text'
        }));
      }

      return response;
    },
    onSuccess: () => {
      setCurrentMessage("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["/api/support/chat/messages", selectedSession?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'chat_attachment');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
  });

  const endSessionMutation = useMutation({
    mutationFn: () =>
      apiRequest('/api/support/chat/end', {
        method: 'POST',
        body: { sessionId: selectedSession?.id }
      }),
    onSuccess: () => {
      toast({
        title: "Session ended",
        description: "Chat session has been ended",
      });
      setSelectedSession(null);
      queryClient.invalidateQueries({ queryKey: ["/api/support/chat/admin/sessions"] });
    },
  });

  const handleAssignSession = (session: ChatSession) => {
    assignSessionMutation.mutate(session.id);
    setSelectedSession(session);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentMessage.trim() && !selectedFile) return;

    try {
      let attachmentData = null;

      if (selectedFile) {
        setUploading(true);
        const uploadResult = await uploadFileMutation.mutateAsync(selectedFile);
        attachmentData = {
          attachmentUrl: uploadResult.url,
          attachmentName: selectedFile.name,
          attachmentSize: selectedFile.size
        };
        setUploading(false);
      }

      await sendMessageMutation.mutateAsync({
        message: currentMessage || `Sent file: ${selectedFile?.name}`,
        ...attachmentData
      });

    } catch (error) {
      setUploading(false);
      console.error('Error sending message:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      waiting: "secondary",
      active: "default",
      ended: "outline"
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const sessions = sessionsData?.sessions || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingCard count={1} height="h-[700px]" />
          <div className="lg:col-span-2">
            <LoadingCard count={1} height="h-[700px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Chat Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage customer support chat sessions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-1">
          <Card className="h-[700px]">
            <CardHeader>
              <CardTitle>Chat Sessions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="w-full">
                  <TabsTrigger value="waiting">Waiting</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="ended">Ended</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <ScrollArea className="h-[600px]">
                    {sessions.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <MessageSquareIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No {activeTab} sessions</p>
                      </div>
                    ) : (
                      <div className="space-y-2 p-2">
                        {sessions.map((session: ChatSession) => (
                          <div
                            key={session.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedSession?.id === session.id
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                            onClick={() => setSelectedSession(session)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                <span className="font-medium text-sm">
                                  {session.user.firstName} {session.user.lastName}
                                </span>
                              </div>
                              {getStatusBadge(session.status)}
                            </div>

                            <p className="text-sm font-medium mb-1 line-clamp-2">
                              {session.subject}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <ClockIcon className="h-3 w-3" />
                              <span>
                                {new Date(session.startedAt).toLocaleString()}
                              </span>
                            </div>

                            {session.status === 'waiting' && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignSession(session);
                                }}
                                disabled={assignSessionMutation.isPending}
                                className="w-full"
                              >
                                {assignSessionMutation.isPending ? "Assigning..." : "Take Session"}
                              </Button>
                            )}

                            {session.agentName && (
                              <p className="text-xs text-muted-foreground">
                                Agent: {session.agentName}
                              </p>
                            )}

                            {session.rating && (
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < session.rating!
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleIcon className="h-5 w-5" />
                  {selectedSession ? (
                    <>
                      Chat with {selectedSession.user.firstName} {selectedSession.user.lastName}
                      {getStatusBadge(selectedSession.status)}
                    </>
                  ) : (
                    'Select a chat session'
                  )}
                </CardTitle>
                {selectedSession && selectedSession.status === 'active' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => endSessionMutation.mutate()}
                    disabled={endSessionMutation.isPending}
                  >
                    End Chat
                  </Button>
                )}
              </div>
              {selectedSession && (
                <p className="text-sm text-muted-foreground">
                  Subject: {selectedSession.subject}
                </p>
              )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {!selectedSession ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageCircleIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a chat session to start chatting</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg mb-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderRole === 'admin'
                              ? 'bg-primary text-white'
                              : 'bg-white dark:bg-slate-700 border'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <UserIcon className="h-4 w-4" />
                              <span className="text-xs font-medium">
                                {message.senderName} ({message.senderRole})
                              </span>
                            </div>

                            <p className="text-sm mb-2">{message.message}</p>

                            {message.attachmentUrl && (
                              <div className="mt-2 p-2 rounded bg-black/10 dark:bg-white/10">
                                {message.attachmentName && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(message.attachmentName.split('.').pop()?.toLowerCase() || '') ? (
                                  <div>
                                    <img 
                                      src={message.attachmentUrl} 
                                      alt={message.attachmentName}
                                      className="max-w-xs rounded mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => window.open(message.attachmentUrl, '_blank')}
                                    />
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="opacity-75">{message.attachmentName}</span>
                                      {message.attachmentSize && (
                                        <span className="opacity-75">{formatFileSize(message.attachmentSize)}</span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    {getFileIcon(message.attachmentName || '')}
                                    <span className="text-xs font-medium truncate flex-1">
                                      {message.attachmentName}
                                    </span>
                                    {message.attachmentSize && (
                                      <span className="text-xs opacity-75">
                                        {formatFileSize(message.attachmentSize)}
                                      </span>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => window.open(message.attachmentUrl, '_blank')}
                                      className="h-6 w-6 p-0"
                                    >
                                      <DownloadIcon className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}

                            <p className="text-xs opacity-75 mt-1">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* File Preview */}
                  {selectedFile && (
                    <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(selectedFile.name)}
                          <div>
                            <p className="text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedFile(null)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  {selectedSession.status === 'active' && (
                    <form onSubmit={handleSendMessage} className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          placeholder="Type your message..."
                          disabled={sendMessageMutation.isPending || uploading}
                          className="flex-1"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          <PaperclipIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          type="submit"
                          disabled={sendMessageMutation.isPending || uploading || (!currentMessage.trim() && !selectedFile)}
                        >
                          {uploading ? "Uploading..." : <SendIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}