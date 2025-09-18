
import { Router } from 'express';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

// Schema validations
const startChatSchema = z.object({
  subject: z.string().min(1).max(200)
});

const sendMessageSchema = z.object({
  sessionId: z.string(),
  message: z.string().min(1).max(1000),
  messageType: z.enum(['text', 'file', 'image']).default('text'),
  attachmentUrl: z.string().optional(),
  attachmentName: z.string().optional(),
  attachmentSize: z.number().optional()
});

const endChatSchema = z.object({
  sessionId: z.string()
});

// Get active chat session for user
router.get('/active', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const session = await storage.getActiveChatSession(userId);
    
    if (!session) {
      return res.status(404).json({ message: 'No active chat session' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching active chat session:', error);
    res.status(500).json({ message: 'Failed to fetch chat session' });
  }
});

// Start new chat session
router.post('/start', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { subject } = startChatSchema.parse(req.body);

    // Check if user already has an active session
    const existingSession = await storage.getActiveChatSession(userId);
    if (existingSession) {
      return res.status(400).json({ 
        message: 'You already have an active chat session',
        session: existingSession 
      });
    }

    const session = await storage.createChatSession({
      userId,
      subject,
      status: 'waiting'
    });

    // Notify admin about new chat session
    await storage.notifyAdminsNewChatSession(session);

    res.json(session);
  } catch (error) {
    console.error('Error starting chat session:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to start chat session' });
  }
});

// Get messages for a chat session
router.get('/messages/:sessionId', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { sessionId } = req.params;

    // Verify user has access to this session
    const session = await storage.getChatSession(sessionId);
    if (!session || (session.userId !== userId && req.user!.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await storage.getChatMessages(sessionId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Send message in chat
router.post('/message', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const user = req.user!;
    const messageData = sendMessageSchema.parse(req.body);

    // Verify user has access to this session
    const session = await storage.getChatSession(messageData.sessionId);
    if (!session || (session.userId !== userId && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create message
    const message = await storage.createChatMessage({
      sessionId: messageData.sessionId,
      senderId: userId,
      senderName: `${user.firstName} ${user.lastName}`,
      senderRole: user.role,
      message: messageData.message,
      messageType: messageData.messageType,
      attachmentUrl: messageData.attachmentUrl,
      attachmentName: messageData.attachmentName,
      attachmentSize: messageData.attachmentSize
    });

    // Update session status to active if it was waiting and message is from admin
    if (session.status === 'waiting' && user.role === 'admin') {
      await storage.updateChatSessionStatus(messageData.sessionId, 'active', userId);
    }

    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// End chat session
router.post('/end', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const user = req.user!;
    const { sessionId } = endChatSchema.parse(req.body);

    // Verify user has access to this session
    const session = await storage.getChatSession(sessionId);
    if (!session || (session.userId !== userId && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // End session
    await storage.endChatSession(sessionId);

    res.json({ message: 'Chat session ended' });
  } catch (error) {
    console.error('Error ending chat session:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to end chat session' });
  }
});

// Rate chat session (user only)
router.post('/rate', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { sessionId, rating, feedback } = req.body;

    // Verify user owns this session
    const session = await storage.getChatSession(sessionId);
    if (!session || session.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (session.status !== 'ended') {
      return res.status(400).json({ message: 'Can only rate ended sessions' });
    }

    await storage.rateChatSession(sessionId, rating, feedback);

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error rating chat session:', error);
    res.status(500).json({ message: 'Failed to submit rating' });
  }
});

// Admin routes
router.get('/admin/sessions', requireAuth, async (req, res) => {
  try {
    const user = req.user!;
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const sessions = await storage.getChatSessions({
      status: status as string,
      page: Number(page),
      limit: Number(limit)
    });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ message: 'Failed to fetch chat sessions' });
  }
});

router.post('/admin/assign', requireAuth, async (req, res) => {
  try {
    const user = req.user!;
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { sessionId } = req.body;
    
    await storage.assignChatSession(sessionId, user.id, `${user.firstName} ${user.lastName}`);

    res.json({ message: 'Session assigned successfully' });
  } catch (error) {
    console.error('Error assigning chat session:', error);
    res.status(500).json({ message: 'Failed to assign session' });
  }
});

export default router;
