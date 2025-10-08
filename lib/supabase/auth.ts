import { supabase } from './client';
import { SupabaseSync } from './sync';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(email: string, password: string, displayName?: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      if (data.user) {
        // Sync local data to Supabase
        await SupabaseSync.pushToSupabase(data.user.id);

        return {
          id: data.user.id,
          email: data.user.email!,
          displayName: displayName,
        };
      }

      return null;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn(email: string, password: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user) {
        // Sync data from Supabase to localStorage
        await SupabaseSync.pullFromSupabase(data.user.id);

        return {
          id: data.user.id,
          email: data.user.email!,
          displayName: data.user.user_metadata?.display_name,
        };
      }

      return null;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      // Optionally clear localStorage (or keep it for offline use)
      // localStorage.clear();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  /**
   * Get the current user
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Get user error:', error);
        return null;
      }

      if (user) {
        return {
          id: user.id,
          email: user.email!,
          displayName: user.user_metadata?.display_name,
          avatarUrl: user.user_metadata?.avatar_url,
        };
      }

      return null;
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          callback({
            id: session.user.id,
            email: session.user.email!,
            displayName: session.user.user_metadata?.display_name,
            avatarUrl: session.user.user_metadata?.avatar_url,
          });

          // Sync on login
          if (event === 'SIGNED_IN') {
            await SupabaseSync.pullFromSupabase(session.user.id);
          }
        } else {
          callback(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: { displayName?: string; avatarUrl?: string }): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: updates.displayName,
          avatar_url: updates.avatarUrl,
        },
      });

      if (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Reset password error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  }
}
