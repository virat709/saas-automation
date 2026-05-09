'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px', fontFamily: 'sans-serif', lineHeight: '1.8', color: 'var(--text)' }}>
      <Link href="/" style={{ color: 'var(--mid)', textDecoration: 'none', marginBottom: '24px', display: 'inline-block', fontSize: '0.9rem' }}>← Back to Home</Link>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 800 }}>Terms of Service</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Last updated: May 2026</p>
      
      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
      <p>By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>2. Use of Service</h2>
      <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for ensuring the accuracy of all information provided through the platform, including hotel details, menu items, and pricing.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>3. Hotel Owner Responsibilities</h2>
      <p>Hotel owners are solely responsible for the accuracy of their menu, pricing, room availability, and all services listed through their QR portal. We do not guarantee the quality, safety, or delivery of any food or services provided by the hotels registered on this platform.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>4. Payments & Billing</h2>
      <p>Paid plans (Premium and Enterprise) are billed annually. Payments made via UPI are non-refundable once a hotel has been activated. We reserve the right to modify pricing with 30 days advance notice to existing subscribers.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>5. Limitation of Liability</h2>
      <p>In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>6. Termination</h2>
      <p>We may terminate or suspend your account at any time without prior notice if you breach these Terms. Upon termination, your right to use the service will immediately cease.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>7. Changes to Terms</h2>
      <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes via email or in-app notification.</p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '32px', marginBottom: '12px' }}>8. Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us at <b>support@v4virtualservices.com</b>.</p>
    </div>
  );
}
