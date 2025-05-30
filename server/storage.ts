import { 
  users, 
  ngos, 
  donations, 
  messages, 
  donationUpdates,
  achievements,
  type User, 
  type InsertUser,
  type Ngo,
  type InsertNgo,
  type Donation,
  type InsertDonation,
  type Message,
  type InsertMessage,
  type DonationUpdate,
  type InsertDonationUpdate,
  type Achievement,
  type InsertAchievement
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // NGO operations
  getNgo(id: number): Promise<Ngo | undefined>;
  getNgoByUserId(userId: number): Promise<Ngo | undefined>;
  getAllNgos(): Promise<Ngo[]>;
  getVerifiedNgos(): Promise<Ngo[]>;
  getPendingNgos(): Promise<Ngo[]>;
  createNgo(ngo: InsertNgo): Promise<Ngo>;
  updateNgo(id: number, ngo: Partial<InsertNgo>): Promise<Ngo | undefined>;

  // Donation operations
  getDonation(id: number): Promise<Donation | undefined>;
  getDonationsByDonor(donorId: number): Promise<Donation[]>;
  getDonationsByNgo(ngoId: number): Promise<Donation[]>;
  getNearbyDonations(location?: string): Promise<Donation[]>;
  getPendingDonations(): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonation(id: number, donation: Partial<InsertDonation>): Promise<Donation | undefined>;

  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getConversations(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<void>;

  // Donation update operations
  getDonationUpdates(donationId: number): Promise<DonationUpdate[]>;
  createDonationUpdate(update: InsertDonationUpdate): Promise<DonationUpdate>;

  // Achievement operations
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  awardPoints(userId: number, points: number): Promise<void>;
  updateUserStats(userId: number, donations: number, impact: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private ngos: Map<number, Ngo> = new Map();
  private donations: Map<number, Donation> = new Map();
  private messages: Map<number, Message> = new Map();
  private donationUpdates: Map<number, DonationUpdate> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  
  private userIdCounter = 1;
  private ngoIdCounter = 1;
  private donationIdCounter = 1;
  private messageIdCounter = 1;
  private updateIdCounter = 1;
  private achievementIdCounter = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const adminUser: User = {
      id: this.userIdCounter++,
      name: "Admin User",
      email: "admin@sahyog.com",
      password: "hashed_password",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    const donorUser: User = {
      id: this.userIdCounter++,
      name: "John Doe",
      email: "john@example.com",
      password: "hashed_password",
      role: "donor",
      createdAt: new Date(),
    };
    this.users.set(donorUser.id, donorUser);

    const ngoUser: User = {
      id: this.userIdCounter++,
      name: "Priya Sharma",
      email: "priya@brightfuture.org",
      password: "hashed_password",
      role: "ngo",
      createdAt: new Date(),
    };
    this.users.set(ngoUser.id, ngoUser);

    // Create sample NGO
    const sampleNgo: Ngo = {
      id: this.ngoIdCounter++,
      userId: ngoUser.id,
      organizationName: "Bright Future Foundation",
      description: "Providing education and nutrition to underprivileged children",
      mission: "Breaking the cycle of poverty through education and healthcare",
      location: "Mumbai, Maharashtra",
      verified: true,
      impactScore: "97.5",
      focusAreas: ["Education", "Nutrition", "Healthcare", "Child Welfare"],
      registrationNumber: "NGO/2015/BFF",
      website: "https://brightfuture.org",
      phone: "+91-9876543210",
      createdAt: new Date(),
    };
    this.ngos.set(sampleNgo.id, sampleNgo);

    // Create sample donation
    const sampleDonation: Donation = {
      id: this.donationIdCounter++,
      donorId: donorUser.id,
      ngoId: sampleNgo.id,
      title: "Fresh Vegetable Package",
      description: "Organic vegetables from our farm",
      type: "food",
      quantity: "50 meal portions",
      amount: null,
      status: "in_transit",
      urgency: "medium",
      pickupAddress: "123 Farm Road, Mumbai",
      pickupTime: "morning",
      estimatedImpact: 50,
      actualImpact: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.donations.set(sampleDonation.id, sampleDonation);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      ...userData,
      id: this.userIdCounter++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // NGO operations
  async getNgo(id: number): Promise<Ngo | undefined> {
    return this.ngos.get(id);
  }

  async getNgoByUserId(userId: number): Promise<Ngo | undefined> {
    return Array.from(this.ngos.values()).find(ngo => ngo.userId === userId);
  }

  async getAllNgos(): Promise<Ngo[]> {
    return Array.from(this.ngos.values());
  }

  async getVerifiedNgos(): Promise<Ngo[]> {
    return Array.from(this.ngos.values()).filter(ngo => ngo.verified);
  }

  async getPendingNgos(): Promise<Ngo[]> {
    return Array.from(this.ngos.values()).filter(ngo => !ngo.verified);
  }

  async createNgo(ngoData: InsertNgo): Promise<Ngo> {
    const ngo: Ngo = {
      ...ngoData,
      id: this.ngoIdCounter++,
      createdAt: new Date(),
    };
    this.ngos.set(ngo.id, ngo);
    return ngo;
  }

  async updateNgo(id: number, ngoData: Partial<InsertNgo>): Promise<Ngo | undefined> {
    const ngo = this.ngos.get(id);
    if (!ngo) return undefined;
    
    const updatedNgo = { ...ngo, ...ngoData };
    this.ngos.set(id, updatedNgo);
    return updatedNgo;
  }

  // Donation operations
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getDonationsByDonor(donorId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(donation => donation.donorId === donorId);
  }

  async getDonationsByNgo(ngoId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(donation => donation.ngoId === ngoId);
  }

  async getNearbyDonations(location?: string): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(donation => donation.status === "pending");
  }

  async getPendingDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(donation => donation.status === "pending");
  }

  async createDonation(donationData: InsertDonation): Promise<Donation> {
    const donation: Donation = {
      ...donationData,
      id: this.donationIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.donations.set(donation.id, donation);
    return donation;
  }

  async updateDonation(id: number, donationData: Partial<InsertDonation>): Promise<Donation | undefined> {
    const donation = this.donations.get(id);
    if (!donation) return undefined;
    
    const updatedDonation = { ...donation, ...donationData, updatedAt: new Date() };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => 
        (message.senderId === user1Id && message.receiverId === user2Id) ||
        (message.senderId === user2Id && message.receiverId === user1Id)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getConversations(userId: number): Promise<Message[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(message => message.senderId === userId || message.receiverId === userId);
    
    // Group by conversation partner and return latest message from each
    const conversations = new Map<number, Message>();
    
    userMessages.forEach(message => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      const existing = conversations.get(partnerId);
      
      if (!existing || message.createdAt > existing.createdAt) {
        conversations.set(partnerId, message);
      }
    });
    
    return Array.from(conversations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const message: Message = {
      ...messageData,
      id: this.messageIdCounter++,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      message.read = true;
      this.messages.set(id, message);
    }
  }

  // Donation update operations
  async getDonationUpdates(donationId: number): Promise<DonationUpdate[]> {
    return Array.from(this.donationUpdates.values())
      .filter(update => update.donationId === donationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createDonationUpdate(updateData: InsertDonationUpdate): Promise<DonationUpdate> {
    const update: DonationUpdate = {
      ...updateData,
      id: this.updateIdCounter++,
      createdAt: new Date(),
    };
    this.donationUpdates.set(update.id, update);
    return update;
  }
}

export const storage = new MemStorage();
