import { foreignKey, pgTable, serial, text, timestamp, PgArray, integer} from "drizzle-orm/pg-core";

export const $notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  imageUrl: text("imageUrl"),
  userId: text("user_id").notNull(),
  editorState: text("editor_state"),
});

export type NoteType = typeof $notes.$inferInsert;

export const $logos = pgTable("logos", {
  id: serial("id").primaryKey(),
  originalLogo: text("originalLogo"),
  blackLogo: text("blackLogo"),
  whiteLogo: text("whiteLogo"),
  // Add more fields as necessary for your logos...
});

export type LogoType = typeof $logos.$inferInsert;


export const $projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectName: text("project_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id").notNull(),
  imageUrl: text("imageUrl"),
  logoId: integer("logo_id").references(() => $logos.id), // Add foreign key relation to logos
  color: text("color")
  // Add more fields as necessary for your projects...
});

export type ProjectType = typeof $projects.$inferInsert;


// drizzle-orm
// drizzle-kit
