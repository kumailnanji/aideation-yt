import { foreignKey, pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const $users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // ... other user fields if needed
});

export type UserType = typeof $users.$inferInsert;

export const $projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectName: text("project_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id").references(() => $users.id), // Links project to its owner user
});

export type ProjectType = typeof $projects.$inferInsert;

export const $logo_types = pgTable("logo_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Monogram", "Full Logo", etc.
});

export type LogoTypeType = typeof $logo_types.$inferInsert;

export const $logo_variants = pgTable("logo_variants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(), // "Original", "Black", "White"
});

export type LogoVariantType = typeof $logo_variants.$inferInsert;

export const $logos = pgTable("logos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  projectId: integer("projectId").references(() => $projects.id), // Links logo to its project
  logoTypeId: integer("logoTypeId").references(() => $logo_types.id), // Links logo to its type
  logoVariantId: integer("logoVariantId").references(() => $logo_variants.id), // Links logo to its color variant
});

export type LogoEntryType = typeof $logos.$inferInsert;

export const $colors = pgTable("colors", {
  id: serial("id").primaryKey(),
  hexCode: text("hexCode").notNull(),
  projectId: integer("projectId").references(() => $projects.id), // Links color to its project
});

export type ColorType = typeof $colors.$inferInsert;

// Relations

export const usersRelations = relations($users, ({ many }) => ({
  projects: many($projects),
}));

export const projectsRelations = relations($projects, ({ one }) => ({
  user: one($users, {
    fields: [$projects.userId],
    references: [$users.id]
  })
}));

export const logoVariantsRelations = relations($projects, ({ many }) => ({
  logos: many($logos),
}));

export const logosRelations = relations($logos, ({ one }) => ({
  project: one($projects, {
    fields: [$logos.projectId],
    references: [$projects.id]
  })
}));



// export const projectsRelations = relations($projects, ({ many, one }) => ({
//   logos: many($logos),
//   colors: many($colors),
//   user: one($users),  // Assuming you might also want to retrieve the associated user of a project
// }));

// export const logosRelations = relations($logos, ({ one }) => ({
//   logoType: one($logo_types),
//   logoVariant: one($logo_variants),
//   project: one($projects),
// }));
