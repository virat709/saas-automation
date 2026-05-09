import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin init error in staff create:', error);
  }
}

export async function POST(req: Request) {
  try {
    const { email, password, name, phone, hotelId, role } = await req.json();

    if (!email || !password || !hotelId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create the user in Firebase Auth using Admin SDK
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // 2. We return the new UID back to the client. 
    // The client will then save the staff document in Firestore under this UID.
    return NextResponse.json({ 
      success: true, 
      uid: userRecord.uid 
    });

  } catch (error: any) {
    console.error('Error creating staff user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
