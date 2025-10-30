
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

// Send friend request
router.post('/friends/request', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { targetUserId } = z.object({ targetUserId: z.string() }).parse(req.body);

    if (userId === targetUserId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const targetUser = await storage.getUser(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingRequest = await storage.getFriendRequest(userId, targetUserId);
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    const friendRequest = await storage.createFriendRequest({
      fromUserId: userId,
      toUserId: targetUserId,
      status: 'pending',
      createdAt: new Date()
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Failed to send friend request' });
  }
});

// Get friend requests (incoming)
router.get('/friends/requests/incoming', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const requests = await storage.getIncomingFriendRequests(userId);
    res.json(requests);
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ message: 'Failed to fetch friend requests' });
  }
});

// Accept/Reject friend request
router.patch('/friends/requests/:requestId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { action } = z.object({ action: z.enum(['accept', 'reject']) }).parse(req.body);
    const userId = req.user!.id;

    const request = await storage.getFriendRequestById(requestId);
    if (!request || request.toUserId !== userId) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (action === 'accept') {
      await storage.createFriendship(request.fromUserId, request.toUserId);
    }

    await storage.updateFriendRequest(requestId, { status: action === 'accept' ? 'accepted' : 'rejected' });
    
    res.json({ message: `Friend request ${action}ed successfully` });
  } catch (error) {
    console.error('Update friend request error:', error);
    res.status(500).json({ message: 'Failed to update friend request' });
  }
});

// Get friends list
router.get('/friends', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const friends = await storage.getUserFriends(userId);
    res.json(friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Failed to fetch friends' });
  }
});

// Remove friend
router.delete('/friends/:friendId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { friendId } = req.params;
    const userId = req.user!.id;

    await storage.removeFriendship(userId, friendId);
    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Failed to remove friend' });
  }
});

// Follow/Unfollow user
router.post('/follow/:targetUserId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user!.id;

    if (userId === targetUserId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const isFollowing = await storage.isFollowing(userId, targetUserId);
    
    if (isFollowing) {
      await storage.unfollowUser(userId, targetUserId);
      res.json({ message: 'User unfollowed', following: false });
    } else {
      await storage.followUser(userId, targetUserId);
      res.json({ message: 'User followed', following: true });
    }
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({ message: 'Failed to update follow status' });
  }
});

// Get following list
router.get('/following', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const following = await storage.getUserFollowing(userId);
    res.json(following);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Failed to fetch following list' });
  }
});

// Get followers list
router.get('/followers', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const followers = await storage.getUserFollowers(userId);
    res.json(followers);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Failed to fetch followers list' });
  }
});

export default router;
