import { Router } from 'express';
import { z } from 'zod';
import { storage } from './storage'; // Assuming a storage service for persistence

const router = Router();

// In-memory store for chat sessions and messages for demonstration
// In a real application, this would be backed by a database.
const chatSessions: Record<string, any> = {};
const chatMessages: Record<string, any[]> = {};

// Zod schemas for validation
const StartChatSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
});

const SendMessageSchema = z.object({
  sessionId: z.string(),
  message: z.string().min(1),
});

const EndChatSchema = z.object({
  sessionId: z.string(),
});

const RateChatSchema = z.object({
  sessionId: z.string(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

const CreateTicketSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

// GET /api/support/chat/active - Get the user's active chat session
router.get('/chat/active', async (req, res) => {
  const userId = (req as any).user?.id; // Assuming user ID is available on the request
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const activeSession = Object.values(chatSessions).find(
    (session) => session.userId === userId && session.status !== 'ended'
  );

  if (activeSession) {
    res.json(activeSession);
  } else {
    res.status(404).json({ error: 'No active chat session found' });
  }
});

// POST /api/support/chat/start - Start a new chat session
router.post('/chat/start', async (req, res) => {
  try {
    const { subject } = StartChatSchema.parse(req.body);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newSession = {
      id: `sess_${Date.now()}`,
      userId,
      subject,
      status: 'waiting',
      startedAt: new Date().toISOString(),
      agentId: undefined,
      agentName: undefined,
    };

    chatSessions[newSession.id] = newSession;
    chatMessages[newSession.id] = [];

    res.status(201).json(newSession);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// GET /api/support/chat/messages - Get messages for a session
router.get('/chat/messages/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const messages = chatMessages[sessionId];

  if (messages) {
    res.json(messages);
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// POST /api/support/chat/message - Send a message
router.post('/chat/message', (req, res) => {
  try {
    const { sessionId, message } = SendMessageSchema.parse(req.body);
    const userId = (req as any).user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const session = chatSessions[sessionId];
    if (!session || session.userId !== userId) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      senderName: 'You', // In a real app, get user's name
      senderRole: 'user',
      message,
      messageType: 'text',
      createdAt: new Date().toISOString(),
    };

    chatMessages[sessionId].push(newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// POST /api/support/chat/end - End a chat session
router.post('/chat/end', (req, res) => {
  try {
    const { sessionId } = EndChatSchema.parse(req.body);
    const session = chatSessions[sessionId];
    
    if (session) {
      session.status = 'ended';
      session.endedAt = new Date().toISOString();
    }

    res.json({ success: true, message: 'Chat ended' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

export default router;
