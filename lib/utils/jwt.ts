import jwt from 'jsonwebtoken';

// Use environment variable or fallback to a default secret (should be changed in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRATION = '7d'; // Token expires in 7 days

export interface JwtPayload {
    userId: string;
    email: string;
    name: string;
}

/**
 * Generate a JWT token for a user
 * @param payload - User data to include in the token
 * @returns Signed JWT token
 */
export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload if valid, null if invalid
 */
export function verifyToken(token: string): JwtPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}
