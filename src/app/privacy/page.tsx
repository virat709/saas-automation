'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px', fontFamily: 'sans-serif', lineHeight: '1.8', color: 'var(--text)' }}>
      <Link href="/" style={{ color: 'var(--mid)', textDecoration: 'none', marginBottom: '24px', display: 'inline-block', fontSize: '0.9rem' }}>← Back to Home</Link>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 800 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Last updated: May 2026</p>
      
      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>1. Information We Collect</h2>
      <p>We collect information you provide directly to us when you register for an account, create or modify your profile, request services, or communicate with us. This may include your name, email address, phone number, and hotel details.</p>
      <p style={{ marginTop: '12px' }}>For hotel guests, we collect only the room number and name you voluntarily provide when placing an order or requesting a service through the QR portal. We do not require guests to create an account.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>2. How We Use Your Information</h2>
      <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send notifications, and provide customer support. Hotel owner data is used for account management and billing purposes.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>3. Data Security</h2>
      <p>We implement appropriate technical and organizational measures to protect the security of your personal information against unauthorized access, loss, or misuse. All data is transmitted over encrypted HTTPS connections and stored on secure, access-controlled cloud infrastructure provided by Google Firebase.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>4. Data Retention</h2>
      <p>We retain your personal information for as long as your account is active or as needed to provide you services. Hotel owners may request deletion of their hotel data and associated records at any time by contacting us.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>5. Third-Party Services</h2>
      <p>We use Google Firebase for authentication, database, and cloud messaging services. We use Telegram for real-time notification delivery. These services are governed by their respective privacy policies.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>6. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at <b>support@v4virtualservices.com</b>.</p>
    </div>
  );
}
