import {
    pgTable,
    serial,
    text,
    varchar,
    boolean,
    timestamp,
    integer,
    primaryKey,
    real,
  } from 'drizzle-orm/pg-core';
  import { relations } from 'drizzle-orm';
  
  export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content'),
    description: text('description').notNull(),
    image: text('image').notNull(),
    category: text('category').notNull(),
    views: integer('views').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  });
  
  export const contentSections = pgTable('content_sections', {
    id: serial('id').primaryKey(),
    type: text('type').notNull(),
    content: text('content'),
    src: text('src'),
    order: integer('order').notNull(),
    postId: integer('post_id').notNull().references(() => posts.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  });
  
  export const users = pgTable('users', {
    id: varchar('id', { length: 191 }).primaryKey(),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: boolean().default(false),
    image: text('image'),
  });
  
  export const accounts = pgTable('accounts', {
    id: varchar('id', { length: 191 }).primaryKey(),
    userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 191 }).notNull(),
    provider: varchar('provider', { length: 191 }).notNull(),
    providerAccountId: varchar('provider_account_id', { length: 191 }).notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: varchar('token_type', { length: 191 }),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
  });
  
  export const sessions = pgTable('sessions', {
    id: varchar('id', { length: 191 }).primaryKey(),
    sessionToken: varchar('session_token', { length: 191 }).notNull().unique(),
    userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires').notNull(),
  });
  
  export const messages = pgTable('messages', {
    id: varchar('id', { length: 191 }).primaryKey(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  });
  
  export const postPremiums = pgTable('post_premiums', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content'),
    description: text('description').notNull(),
    image: text('image').notNull(),
    price: real('price').notNull(),
    category: text('category').notNull(),
    views: integer('views').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  });
  
  export const premiumContentSections = pgTable('premium_content_sections', {
    id: serial('id').primaryKey(),
    type: text('type').notNull(),
    content: text('content'),
    src: text('src'),
    order: integer('order').notNull(),
    postPremiumId: integer('post_premium_id').notNull().references(() => postPremiums.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  });
  
  export const transactionHistories = pgTable('transaction_histories', {
    id: varchar('id', { length: 191 }).primaryKey(),
    userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id),
    postPremiumId: integer('post_premium_id').notNull().references(() => postPremiums.id),
    amount: real('amount').notNull(),
    status: text('status').notNull(),
    midtransId: varchar('midtrans_id', { length: 191 }).notNull().unique(),
    paymentMethod: text('payment_method'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  });
  
  export const favorites = pgTable('favorites', {
    userId: varchar('user_id', { length: 191 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  }, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.postId] }), // Using composite primary key instead of serial id
  }));
  export const postsRelations = relations(posts, ({ many }) => ({
    contentSections: many(contentSections),
    favorites: many(favorites),
  }));
  
  export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    messages: many(messages),
    favorites: many(favorites),
    transactions: many(transactionHistories),
  }));
  
  export const postPremiumsRelations = relations(postPremiums, ({ many }) => ({
    premiumContentSections: many(premiumContentSections),
    transactions: many(transactionHistories),
  }));