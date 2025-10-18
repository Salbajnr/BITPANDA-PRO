import { Router, Request, Response } from 'express';
import { requireAuth } from './simple-auth';

const router = Router();

// Store active SSE connections
declare global {
  var sseClients: Map<string, express.Response> | undefined;
}

global.sseClients = global.sseClients || new Map();

// SSE endpoint for notifications
router.get('/notifications/stream', requireAuth, (req: Request, res: Response) => {
  const userId = req.user!.id;

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection event
  res.write(`data: ${JSON.stringify({
    type: 'connected',
    message: 'Connected to notification stream',
    timestamp: Date.now()
  })}\n\n`);

  // Store connection
  activeConnections.set(userId, res);

  // Handle client disconnect
  req.on('close', () => {
    console.log(`📡 SSE client disconnected: ${userId}`);
    activeConnections.delete(userId);
  });

  req.on('error', (error) => {
    console.error(`📡 SSE error for user ${userId}:`, error);
    activeConnections.delete(userId);
  });

  console.log(`📡 SSE client connected: ${userId}`);
});

// SSE endpoint for admin dashboard updates
router.get('/admin/stream', requireAuth, (req: Request, res: Response) => {
  const adminId = req.user!.id;

  // Verify admin permissions
  if (req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection event
  res.write(`data: ${JSON.stringify({
    type: 'connected',
    message: 'Connected to admin stream',
    timestamp: Date.now()
  })}\n\n`);

  // Store connection with admin prefix
  activeConnections.set(`admin_${adminId}`, res);

  // Handle client disconnect
  req.on('close', () => {
    console.log(`📡 Admin SSE client disconnected: ${adminId}`);
    activeConnections.delete(`admin_${adminId}`);
  });

  req.on('error', (error) => {
    console.error(`📡 Admin SSE error for ${adminId}:`, error);
    activeConnections.delete(`admin_${adminId}`);
  });

  console.log(`📡 Admin SSE client connected: ${adminId}`);
});

// Function to send SSE event to specific user
export const sendSSEToUser = (userId: string, data: any) => {
  const connection = activeConnections.get(userId);
  if (connection) {
    try {
      connection.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error(`Error sending SSE to user ${userId}:`, error);
      activeConnections.delete(userId);
    }
  }
};

// Function to send SSE event to all connected users
export const broadcastSSE = (data: any) => {
  activeConnections.forEach((connection, userId) => {
    if (!userId.startsWith('admin_')) {
      try {
        connection.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error(`Error broadcasting SSE to user ${userId}:`, error);
        activeConnections.delete(userId);
      }
    }
  });
};

// Function to send SSE event to all admin connections
export const broadcastSSEToAdmins = (data: any) => {
  activeConnections.forEach((connection, userId) => {
    if (userId.startsWith('admin_')) {
      try {
        connection.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error(`Error broadcasting SSE to admin ${userId}:`, error);
        activeConnections.delete(userId);
      }
    }
  });
};

// Function to get connection stats
export const getSSEStats = () => {
  const totalConnections = activeConnections.size;
  const adminConnections = Array.from(activeConnections.keys()).filter(id => id.startsWith('admin_')).length;
  const userConnections = totalConnections - adminConnections;

  return {
    total: totalConnections,
    users: userConnections,
    admins: adminConnections
  };
};

// --- Portfolio Real-time Updates ---

// TODO: Implement real-time WebSocket connections for portfolio updates.
// This will involve setting up a WebSocket server and broadcasting portfolio changes
// to connected clients. We'll need to integrate this with the client-side hooks
// to ensure seamless updates.

// For now, we can simulate this by using the existing SSE mechanism to broadcast
// portfolio updates to all connected users when changes occur.

// Placeholder function to simulate portfolio update broadcast
export const broadcastPortfolioUpdate = (portfolioData: any) => {
  console.log('Broadcasting portfolio update:', portfolioData);
  // In a real implementation, this would broadcast via WebSockets.
  // For now, we'll use SSE to broadcast to all connected users.
  broadcastSSE({ type: 'portfolio_update', data: portfolioData });
};

export default router;