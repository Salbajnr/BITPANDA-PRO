
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { parse } from 'url';
import { storage } from './storage';

interface ChatClient {
  ws: WebSocket;
  userId: string;
  sessionId?: string;
  role: string;
  lastActivity: Date;
}

class ChatWebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, ChatClient>();
  private sessionClients = new Map<string, Set<string>>(); // sessionId -> set of clientIds

  initialize(server: Server): void {
    this.wss = new WebSocketServer({
      server,
      path: '/ws/chat',
    });

    this.wss.on('connection', (ws, request) => {
      const clientId = this.generateClientId();
      console.log(`💬 Chat WebSocket client connected: ${clientId}`);

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(clientId, ws, message);
        } catch (error) {
          console.error('💬 Chat WebSocket message error:', error);
          this.sendToClient(ws, {
            type: 'error',
            message: 'Invalid message format'
          });
        }
      });

      ws.on('close', () => {
        console.log(`💬 Chat WebSocket client disconnected: ${clientId}`);
        this.removeClient(clientId);
      });

      ws.on('error', (error) => {
        console.error(`💬 Chat WebSocket error for client ${clientId}:`, error);
        this.removeClient(clientId);
      });

      // Send welcome message
      this.sendToClient(ws, {
        type: 'connection',
        message: 'Connected to chat server',
        clientId
      });
    });

    console.log('💬 Chat WebSocket server initialized on /ws/chat');
  }

  private async handleMessage(clientId: string, ws: WebSocket, message: any): Promise<void> {
    try {
      switch (message.type) {
        case 'authenticate':
          await this.handleAuthentication(clientId, ws, message);
          break;

        case 'join_session':
          await this.handleJoinSession(clientId, message);
          break;

        case 'send_message':
          await this.handleSendMessage(clientId, message);
          break;

        case 'typing':
          await this.handleTyping(clientId, message);
          break;

        case 'leave_session':
          this.handleLeaveSession(clientId);
          break;

        default:
          this.sendToClient(ws, {
            type: 'error',
            message: 'Unknown message type'
          });
      }
    } catch (error) {
      console.error('Error handling chat message:', error);
      this.sendToClient(ws, {
        type: 'error',
        message: 'Failed to process message'
      });
    }
  }

  private async handleAuthentication(clientId: string, ws: WebSocket, message: any): Promise<void> {
    const { userId, role } = message;
    
    this.clients.set(clientId, {
      ws,
      userId,
      role: role || 'user',
      lastActivity: new Date()
    });

    this.sendToClient(ws, {
      type: 'authenticated',
      message: 'Authentication successful'
    });
  }

  private async handleJoinSession(clientId: string, message: any): Promise<void> {
    const { sessionId, userId } = message;
    const client = this.clients.get(clientId);
    
    if (!client) {
      return;
    }

    // Verify access to session
    const session = await storage.getChatSession(sessionId);
    if (!session || (session.userId !== userId && client.role !== 'admin')) {
      this.sendToClient(client.ws, {
        type: 'error',
        message: 'Access denied to this session'
      });
      return;
    }

    // Add client to session
    client.sessionId = sessionId;
    this.clients.set(clientId, client);

    if (!this.sessionClients.has(sessionId)) {
      this.sessionClients.set(sessionId, new Set());
    }
    this.sessionClients.get(sessionId)!.add(clientId);

    // Notify other clients in session
    this.broadcastToSession(sessionId, {
      type: 'user_joined',
      userId: client.userId,
      role: client.role
    }, clientId);

    this.sendToClient(client.ws, {
      type: 'session_joined',
      sessionId,
      message: 'Successfully joined session'
    });
  }

  private async handleSendMessage(clientId: string, message: any): Promise<void> {
    const { sessionId, message: messageText, attachmentUrl, messageType } = message;
    const client = this.clients.get(clientId);
    
    if (!client || client.sessionId !== sessionId) {
      return;
    }

    // Broadcast message to all clients in session
    this.broadcastToSession(sessionId, {
      type: 'new_message',
      sessionId,
      senderId: client.userId,
      message: messageText,
      attachmentUrl,
      messageType: messageType || 'text',
      timestamp: new Date().toISOString()
    });
  }

  private async handleTyping(clientId: string, message: any): Promise<void> {
    const { sessionId, isTyping } = message;
    const client = this.clients.get(clientId);
    
    if (!client || client.sessionId !== sessionId) {
      return;
    }

    // Broadcast typing indicator to other clients in session
    this.broadcastToSession(sessionId, {
      type: 'user_typing',
      userId: client.userId,
      isTyping
    }, clientId);
  }

  private handleLeaveSession(clientId: string): void {
    const client = this.clients.get(clientId);
    
    if (!client || !client.sessionId) {
      return;
    }

    const sessionId = client.sessionId;
    
    // Remove from session clients
    const sessionClients = this.sessionClients.get(sessionId);
    if (sessionClients) {
      sessionClients.delete(clientId);
      if (sessionClients.size === 0) {
        this.sessionClients.delete(sessionId);
      }
    }

    // Notify other clients
    this.broadcastToSession(sessionId, {
      type: 'user_left',
      userId: client.userId
    }, clientId);

    // Clear session from client
    client.sessionId = undefined;
    this.clients.set(clientId, client);
  }

  private removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    
    if (client && client.sessionId) {
      this.handleLeaveSession(clientId);
    }
    
    this.clients.delete(clientId);
  }

  private broadcastToSession(sessionId: string, message: any, excludeClientId?: string): void {
    const sessionClients = this.sessionClients.get(sessionId);
    
    if (!sessionClients) {
      return;
    }

    sessionClients.forEach(clientId => {
      if (clientId === excludeClientId) {
        return;
      }

      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(client.ws, message);
      }
    });
  }

  private sendToClient(ws: WebSocket, message: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private generateClientId(): string {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for external use
  notifySessionStatusChange(sessionId: string, status: string, agentName?: string): void {
    this.broadcastToSession(sessionId, {
      type: 'session_status_changed',
      sessionId,
      status,
      agentName
    });
  }

  notifyNewMessage(sessionId: string, messageData: any): void {
    this.broadcastToSession(sessionId, {
      type: 'new_message',
      sessionId,
      ...messageData
    });
  }

  getActiveSessionsCount(): number {
    return this.sessionClients.size;
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  shutdown(): void {
    this.clients.clear();
    this.sessionClients.clear();
    if (this.wss) {
      this.wss.close();
    }
  }
}

export const chatWebSocketManager = new ChatWebSocketManager();
