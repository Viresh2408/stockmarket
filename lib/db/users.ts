import fs from 'fs';
import path from 'path';

export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: string;
}

export type UserWithoutPassword = Omit<User, 'passwordHash'>;

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

/**
 * Ensure the data directory and users file exist
 */
function ensureDataFile(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
}

/**
 * Read all users from the database
 */
function readUsers(): User[] {
    ensureDataFile();
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data) as User[];
}

/**
 * Write users to the database
 */
function writeUsers(users: User[]): void {
    ensureDataFile();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/**
 * Generate a unique user ID
 */
function generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new user in the database
 * @param email - User email
 * @param name - User name
 * @param passwordHash - Hashed password
 * @returns The created user (without password)
 */
export function createUser(
    email: string,
    name: string,
    passwordHash: string
): UserWithoutPassword {
    const users = readUsers();

    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('User with this email already exists');
    }

    const newUser: User = {
        id: generateId(),
        email: email.toLowerCase(),
        name,
        passwordHash,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

/**
 * Find a user by email
 * @param email - User email
 * @returns User if found, null otherwise
 */
export function findUserByEmail(email: string): User | null {
    const users = readUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find a user by ID
 * @param id - User ID
 * @returns User if found, null otherwise
 */
export function findUserById(id: string): User | null {
    const users = readUsers();
    return users.find(u => u.id === id) || null;
}

/**
 * Remove password from user object
 * @param user - User with password
 * @returns User without password
 */
export function sanitizeUser(user: User): UserWithoutPassword {
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
