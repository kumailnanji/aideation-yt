import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const $notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  imageUrl: text("imageUrl"),
  userId: text("user_id").notNull(),
  editorState: text("editor_state"),
});

export type NoteType = typeof $notes.$inferInsert;

export const $projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectName: text("project_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id").notNull(),
  imageUrl: text("imageUrl"),
  // Add more fields as necessary for your projects...
});

export type ProjectType = typeof $projects.$inferInsert;

// drizzle-orm
// drizzle-kit
