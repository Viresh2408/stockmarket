import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    UserCredential,
    updateProfile,
} from 'firebase/auth';
import { auth } from './config';

// Sign up with email and password
export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
): Promise<UserCredential> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update display name if provided
        if (displayName && userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
        }

        return userCredential;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign up');
    }
};

// Sign in with email and password
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign in');
    }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account',
        });
        return await signInWithPopup(auth, provider);
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign in with Google');
    }
};

// Sign out
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign out');
    }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        throw new Error(error.message || 'Failed to send reset email');
    }
};
