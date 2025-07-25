import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-super-securise-changez-le';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
}

// Générer un token JWT
export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Vérifier un token JWT
export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Hasher un mot de passe
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Vérifier un mot de passe
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Middleware pour vérifier l'authentification
export function withAuth(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Token manquant' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'Token invalide' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ajouter les informations de l'admin à la requête
    (request as Request & { admin: typeof payload }).admin = payload;
    
    return handler(request);
  };
} 