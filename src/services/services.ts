// src/services/auth.service.ts
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '../db/schema';

interface GoogleAuthData {
  username: string;
  email: string;
  image?: string;
}

const db = drizzle(process.env.DATABASE_URL!);

export async function loginWithGoogle(data: GoogleAuthData) {
    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .execute();
  
      if (existingUser.length > 0) {
        // Update existing user
        await db.update(users)
          .set({
            name: data.username,
            image: data.image,
          })
          .where(eq(users.email, data.email))
          .execute();
  
        return existingUser[0];
      }
  
      // Create new user
      const newUser = {
        id: nanoid(),
        name: data.username,
        email: data.email,
        image: data.image,
        emailVerified: true,
      };
  
      await db.insert(users).values(newUser).execute();
  
      return newUser;
    } catch (error) {
      console.error('Error in loginWithGoogle:', error);
      throw new Error('Failed to process Google login');
    }
  }
  