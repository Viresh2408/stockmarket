import { createUser, findUserByEmail, findUserById, sanitizeUser, UserWithoutPassword } from '@/lib/db/users';
import { hashPassword, comparePassword } from '@/lib/utils/password';
import { generateToken, verifyToken } from '@/lib/utils/jwt';

export interface SignUpData {
    email: string;
    password: string;
    name: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthResult {
    user: UserWithoutPassword;
    token: string;
}

/**
 * Sign up a new user
 * @param data - Sign up data (email, password, name)
 * @returns User data and JWT token
 */
export async function signUp(data: SignUpData): Promise<AuthResult> {
    const { email, password, name } = data;

    // Validate input
    if (!email || !password || !name) {
        throw new Error('Email, password, and name are required');
    }

    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = createUser(email, name, passwordHash);

    // Generate token
    const token = generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
    });

    return { user, token };
}

/**
 * Sign in an existing user
 * @param data - Sign in data (email, password)
 * @returns User data and JWT token
 */
export async function signIn(data: SignInData): Promise<AuthResult> {
    const { email, password } = data;

    // Validate input
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
        throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
    });

    return { user: sanitizeUser(user), token };
}

/**
 * Get current user from JWT token
 * @param token - JWT token
 * @returns User data if valid, null otherwise
 */
export function getCurrentUser(token: string): UserWithoutPassword | null {
    const payload = verifyToken(token);
    if (!payload) {
        return null;
    }

    const user = findUserById(payload.userId);
    if (!user) {
        return null;
    }

    return sanitizeUser(user);
}
