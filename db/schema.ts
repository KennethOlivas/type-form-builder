import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const workspace = pgTable("workspace", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("folder"),
  type: text("type").notNull().default("personal"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const workspaceForm = pgTable("workspace_form", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  formId: text("form_id")
    .notNull()
    .references(() => form.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const form = pgTable("form", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  style: jsonb("style").notNull(),
  welcomeScreen: jsonb("welcome_screen"),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const question = pgTable("question", {
  id: text("id").primaryKey(),
  formId: text("form_id")
    .notNull()
    .references(() => form.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  label: text("label").notNull(),
  description: text("description"),
  placeholder: text("placeholder"),
  required: boolean("required").notNull().default(true),
  options: jsonb("options"),
  allowMultiple: boolean("allow_multiple").default(false),
  ratingScale: integer("rating_scale"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const logicJump = pgTable("logic_jump", {
  id: text("id").primaryKey(),
  questionId: text("question_id")
    .notNull()
    .references(() => question.id, { onDelete: "cascade" }),
  enabled: boolean("enabled").notNull().default(false),
  defaultDestinationType: text("default_destination_type").notNull(),
  defaultDestinationQuestionId: text("default_destination_question_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const logicRule = pgTable("logic_rule", {
  id: text("id").primaryKey(),
  logicJumpId: text("logic_jump_id")
    .notNull()
    .references(() => logicJump.id, { onDelete: "cascade" }),
  operator: text("operator").notNull(),
  value: text("value"),
  valueMax: text("value_max"),
  destinationType: text("destination_type").notNull(),
  destinationQuestionId: text("destination_question_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const submission = pgTable("submission", {
  id: text("id").primaryKey(),
  formId: text("form_id")
    .notNull()
    .references(() => form.id, { onDelete: "cascade" }),
  answers: jsonb("answers").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  device: text("device").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const formVisit = pgTable("form_visit", {
  id: text("id").primaryKey(),
  formId: text("form_id")
    .notNull()
    .references(() => form.id, { onDelete: "cascade" }),
  device: text("device"), // 'desktop', 'mobile', 'tablet'
  browser: text("browser"),
  os: text("os"),
  ip: text("ip"),
  country: text("country"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastInteractionAt: timestamp("last_interaction_at").defaultNow().notNull(),
  lastQuestionId: text("last_question_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const schema = {
  user,
  session,
  account,
  verification,
  form,
  question,
  logicJump,
  logicRule,
  submission,
  formVisit,
};

export const formRelations = relations(form, ({ one, many }) => ({
  questions: many(question),
  submissions: many(submission),
  visits: many(formVisit),
  author: one(user, {
    fields: [form.createdBy],
    references: [user.id],
  }),
}));

export const questionRelations = relations(question, ({ one, many }) => ({
  form: one(form, {
    fields: [question.formId],
    references: [form.id],
  }),
  logicJumps: many(logicJump),
}));

export const logicJumpRelations = relations(logicJump, ({ one, many }) => ({
  question: one(question, {
    fields: [logicJump.questionId],
    references: [question.id],
  }),
  rules: many(logicRule),
}));

export const logicRuleRelations = relations(logicRule, ({ one }) => ({
  logicJump: one(logicJump, {
    fields: [logicRule.logicJumpId],
    references: [logicJump.id],
  }),
}));

export const submissionRelations = relations(submission, ({ one }) => ({
  form: one(form, {
    fields: [submission.formId],
    references: [form.id],
  }),
}));

export const formVisitRelations = relations(formVisit, ({ one }) => ({
  form: one(form, {
    fields: [formVisit.formId],
    references: [form.id],
  }),
}));
