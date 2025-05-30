import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'donor', 'ngo', 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ngos = pgTable("ngos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  organizationName: text("organization_name").notNull(),
  description: text("description"),
  mission: text("mission"),
  location: text("location").notNull(),
  verified: boolean("verified").default(false),
  impactScore: decimal("impact_score", { precision: 3, scale: 1 }).default("0"),
  focusAreas: text("focus_areas").array(),
  registrationNumber: text("registration_number"),
  website: text("website"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  donorId: integer("donor_id").references(() => users.id).notNull(),
  ngoId: integer("ngo_id").references(() => ngos.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'food', 'clothes', 'money'
  quantity: text("quantity").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  status: text("status").default("pending").notNull(), // 'pending', 'accepted', 'in_transit', 'delivered', 'cancelled'
  urgency: text("urgency").default("medium").notNull(), // 'low', 'medium', 'high', 'critical'
  pickupAddress: text("pickup_address").notNull(),
  pickupTime: text("pickup_time"),
  estimatedImpact: integer("estimated_impact"),
  actualImpact: integer("actual_impact"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  donationId: integer("donation_id").references(() => donations.id),
  content: text("content").notNull(),
  messageType: text("message_type").default("text").notNull(), // 'text', 'image', 'file'
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const donationUpdates = pgTable("donation_updates", {
  id: serial("id").primaryKey(),
  donationId: integer("donation_id").references(() => donations.id).notNull(),
  status: text("status").notNull(),
  message: text("message"),
  updatedBy: integer("updated_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertNgoSchema = createInsertSchema(ngos).omit({
  id: true,
  createdAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertDonationUpdateSchema = createInsertSchema(donationUpdates).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Ngo = typeof ngos.$inferSelect;
export type InsertNgo = z.infer<typeof insertNgoSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type DonationUpdate = typeof donationUpdates.$inferSelect;
export type InsertDonationUpdate = z.infer<typeof insertDonationUpdateSchema>;
