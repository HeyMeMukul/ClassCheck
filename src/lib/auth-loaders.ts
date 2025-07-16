import { redirect } from 'react-router-dom';
import { account } from './appwrite';

export const requireAuth = async () => {
  console.log('🔍 requireAuth loader called');
  try {
    console.log('📡 Calling account.get()...');
    const user = await account.get();
    console.log('✅ User found:', user);
    
    if (!user) {
      console.log('❌ No user, redirecting to /login');
      throw redirect('/login');
    }
    
    const result = { user };
    console.log('🎯 requireAuth returning:', result);
    return result;
  } catch (error) {
    console.log('💥 requireAuth error:', error);
    if (error.message?.includes('redirect')) {
      throw error; // Re-throw redirect
    }
    console.log('🚫 Auth failed, redirecting to /login');
    throw redirect('/login');
  }
};

export const redirectIfAuthenticated = async () => {
  console.log('🔍 redirectIfAuthenticated loader called');
  try {
    const user = await account.get();
    console.log('✅ User check result:', user);
    
    if (user) {
      console.log('🔄 User exists, redirecting to /dashboard');
      throw redirect('/dashboard');
    }
    
    const result = { user: null };
    console.log('🎯 redirectIfAuthenticated returning:', result);
    return result;
  } catch (error) {
    console.log('💥 redirectIfAuthenticated error:', error);
    if (error.message?.includes('redirect')) {
      throw error; // Re-throw redirect
    }
    const result = { user: null };
    console.log('🎯 redirectIfAuthenticated returning (after error):', result);
    return result;
  }
};
