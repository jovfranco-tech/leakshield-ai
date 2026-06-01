import admin from 'firebase-admin';

// Initialize Firebase Admin securely using Server-Side environment variables
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        })
      });
      console.log("[auth] Firebase Admin SDK initialized successfully via Server-Side certificates.");
    } else {
      console.warn("[auth] Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY environment variables.");
    }
  } catch (e) {
    console.error("[auth] Failed to initialize Firebase Admin SDK", e);
  }
}

export interface AuthenticatedUser {
  uid: string;
  email?: string;
}

/**
 * Parses and verifies the Firebase ID Token transmitted in the Authorization Bearer header
 * OWASP-lite security compliance for LeakShield AI v0.2.0
 */
export async function verifyAuthToken(req: any): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn("[auth] Missing or malformed Authorization header.");
    return null;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    console.warn("[auth] Missing Bearer token.");
    return null;
  }

  // Bypassing verification ONLY if the server environment credentials are not set (for initial local development simplicity)
  // But we enforce token parsing to ensure the frontend is sending it.
  const isFirebaseConfigured = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
  
  if (!isFirebaseConfigured) {
    console.warn("[auth] SERVER NOT FULLY CONFIGURED: Firebase Admin environment variables are missing. Bypassing verification for local development.");
    // Return a mock verified user based on base64 decoding (DO NOT use in production)
    try {
      const parts = token.split('.');
      if (parts[1]) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        return {
          uid: payload.user_id || payload.uid || 'dev-local-user',
          email: payload.email || 'dev@example.com'
        };
      }
    } catch (e) {
      // Fallback
    }
    return { uid: 'dev-local-user', email: 'dev@example.com' };
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
  } catch (error) {
    console.error("[auth] Firebase ID Token verification failed:", error);
    return null;
  }
}
