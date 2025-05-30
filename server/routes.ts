import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertDonationSchema, insertNgoSchema, insertMessageSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ message: 'Invalid user data' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // NGO routes
  app.get('/api/ngos', async (req, res) => {
    try {
      const ngos = await storage.getVerifiedNgos();
      res.json(ngos);
    } catch (error) {
      console.error('Get NGOs error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/ngos/pending', authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const ngos = await storage.getPendingNgos();
      res.json(ngos);
    } catch (error) {
      console.error('Get pending NGOs error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/ngos/profile', authenticateToken, async (req: any, res) => {
    try {
      const ngo = await storage.getNgoByUserId(req.user.id);
      if (!ngo) {
        return res.status(404).json({ message: 'NGO profile not found' });
      }
      res.json(ngo);
    } catch (error) {
      console.error('Get NGO profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/ngos', authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'ngo') {
        return res.status(403).json({ message: 'NGO role required' });
      }

      const ngoData = insertNgoSchema.parse({ ...req.body, userId: req.user.id });
      const ngo = await storage.createNgo(ngoData);
      res.json(ngo);
    } catch (error) {
      console.error('Create NGO error:', error);
      res.status(400).json({ message: 'Invalid NGO data' });
    }
  });

  app.patch('/api/ngos/:id/verify', authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const ngoId = parseInt(req.params.id);
      const { verified } = req.body;
      
      const ngo = await storage.updateNgo(ngoId, { verified });
      if (!ngo) {
        return res.status(404).json({ message: 'NGO not found' });
      }

      res.json(ngo);
    } catch (error) {
      console.error('Verify NGO error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Donation routes
  app.get('/api/donations', authenticateToken, async (req: any, res) => {
    try {
      let donations;
      
      if (req.user.role === 'donor') {
        donations = await storage.getDonationsByDonor(req.user.id);
      } else if (req.user.role === 'ngo') {
        const ngo = await storage.getNgoByUserId(req.user.id);
        if (ngo) {
          donations = await storage.getDonationsByNgo(ngo.id);
        } else {
          donations = [];
        }
      } else {
        donations = await storage.getPendingDonations();
      }

      res.json(donations || []);
    } catch (error) {
      console.error('Get donations error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/donations/nearby', authenticateToken, async (req: any, res) => {
    try {
      const donations = await storage.getNearbyDonations();
      res.json(donations);
    } catch (error) {
      console.error('Get nearby donations error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/donations', authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'donor') {
        return res.status(403).json({ message: 'Donor role required' });
      }

      const donationData = insertDonationSchema.parse({
        ...req.body,
        donorId: req.user.id,
      });
      
      const donation = await storage.createDonation(donationData);
      res.json(donation);
    } catch (error) {
      console.error('Create donation error:', error);
      res.status(400).json({ message: 'Invalid donation data' });
    }
  });

  app.patch('/api/donations/:id', authenticateToken, async (req: any, res) => {
    try {
      const donationId = parseInt(req.params.id);
      const donation = await storage.updateDonation(donationId, req.body);
      
      if (!donation) {
        return res.status(404).json({ message: 'Donation not found' });
      }

      res.json(donation);
    } catch (error) {
      console.error('Update donation error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Message routes
  app.get('/api/messages/conversations', authenticateToken, async (req: any, res) => {
    try {
      const conversations = await storage.getConversations(req.user.id);
      res.json(conversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/messages/:userId', authenticateToken, async (req: any, res) => {
    try {
      const otherUserId = parseInt(req.params.userId);
      const messages = await storage.getMessagesBetweenUsers(req.user.id, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/messages', authenticateToken, async (req: any, res) => {
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user.id,
      });
      
      const message = await storage.createMessage(messageData);
      
      // Broadcast to WebSocket clients
      broadcastMessage(message);
      
      res.json(message);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(400).json({ message: 'Invalid message data' });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', async (req, res) => {
    try {
      const ngos = await storage.getAllNgos();
      const donations = await storage.getPendingDonations();
      
      const stats = {
        totalDonations: donations.length,
        verifiedNgos: ngos.filter(ngo => ngo.verified).length,
        totalValue: donations.reduce((sum, donation) => {
          return sum + (donation.amount ? parseFloat(donation.amount) : 0);
        }, 0),
        livesImpacted: donations.reduce((sum, donation) => {
          return sum + (donation.estimatedImpact || 0);
        }, 0),
      };

      res.json(stats);
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<number, WebSocket>();

  wss.on('connection', (ws, req) => {
    let userId: number | null = null;

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth') {
          // Authenticate WebSocket connection
          jwt.verify(message.token, JWT_SECRET, (err: any, user: any) => {
            if (!err && user) {
              userId = user.id;
              clients.set(userId, ws);
              ws.send(JSON.stringify({ type: 'auth_success' }));
            } else {
              ws.send(JSON.stringify({ type: 'auth_error' }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
      }
    });
  });

  // Function to broadcast messages to WebSocket clients
  function broadcastMessage(message: any) {
    const targetClient = clients.get(message.receiverId);
    if (targetClient && targetClient.readyState === WebSocket.OPEN) {
      targetClient.send(JSON.stringify({
        type: 'new_message',
        message,
      }));
    }
  }

  return httpServer;
}
