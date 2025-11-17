import {
  users,
  notes,
  tasks,
  folders,
  quickCaptures,
  type User,
  type UpsertUser,
  type Note,
  type InsertNote,
  type Task,
  type InsertTask,
  type Folder,
  type InsertFolder,
  type QuickCapture,
  type InsertQuickCapture,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Note operations
  getNotesByUser(userId: string): Promise<Note[]>;
  getNote(id: string, userId: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, userId: string, data: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string, userId: string): Promise<boolean>;

  // Task operations
  getTasksByUser(userId: string): Promise<Task[]>;
  getTask(id: string, userId: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, data: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;

  // Folder operations
  getFoldersByUser(userId: string): Promise<Folder[]>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  deleteFolder(id: string, userId: string): Promise<boolean>;

  // Quick capture operations
  getQuickCapturesByUser(userId: string): Promise<QuickCapture[]>;
  createQuickCapture(capture: InsertQuickCapture): Promise<QuickCapture>;
  deleteQuickCapture(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Note operations
  async getNotesByUser(userId: string): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));
  }

  async getNote(id: string, userId: string): Promise<Note | undefined> {
    const [note] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));
    return note || undefined;
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [created] = await db.insert(notes).values(note).returning();
    return created;
  }

  async updateNote(
    id: string,
    userId: string,
    data: Partial<InsertNote>
  ): Promise<Note | undefined> {
    const [updated] = await db
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteNote(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Task operations
  async getTasksByUser(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTask(id: string, userId: string): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await db.insert(tasks).values(task).returning();
    return created;
  }

  async updateTask(
    id: string,
    userId: string,
    data: Partial<InsertTask>
  ): Promise<Task | undefined> {
    const [updated] = await db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Folder operations
  async getFoldersByUser(userId: string): Promise<Folder[]> {
    return await db
      .select()
      .from(folders)
      .where(eq(folders.userId, userId))
      .orderBy(desc(folders.createdAt));
  }

  async createFolder(folder: InsertFolder): Promise<Folder> {
    const [created] = await db.insert(folders).values(folder).returning();
    return created;
  }

  async deleteFolder(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(folders)
      .where(and(eq(folders.id, id), eq(folders.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Quick capture operations
  async getQuickCapturesByUser(userId: string): Promise<QuickCapture[]> {
    return await db
      .select()
      .from(quickCaptures)
      .where(eq(quickCaptures.userId, userId))
      .orderBy(desc(quickCaptures.createdAt));
  }

  async createQuickCapture(capture: InsertQuickCapture): Promise<QuickCapture> {
    const [created] = await db.insert(quickCaptures).values(capture).returning();
    return created;
  }

  async deleteQuickCapture(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(quickCaptures)
      .where(and(eq(quickCaptures.id, id), eq(quickCaptures.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
