'use client';

import { useState, useEffect, use } from 'react';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './guest.module.css';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
}

interface HotelData {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  services: string[];
  customServiceLabels?: Record<string, string>;
  menu: MenuItem[];
  wifiName?: string;
  wifiPassword?: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

const SERVICE_ICONS: Record<string, string> = {
  room_service: '🛎️',
  housekeeping: '🧹',
  laundry: '👕',
  spa: '💆',
  restaurant: '🍽️',
  cab: '🚕',
  wakeup: '⏰',
  checkin: '🏨',
  luggage: '🧳',
  wifi: '📶',
};

const SERVICE_LABELS: Record<string, string> = {
  room_service: 'Room Service',
  housekeeping: 'Housekeeping',
  laundry: 'Laundry',
  spa: 'Spa & Wellness',
  restaurant: 'Restaurant',
  cab: 'Cab Booking',
  wakeup: 'Wake-up Call',
  checkin: 'Early Check-in',
  luggage: 'Luggage Help',
  wifi: 'WiFi Support',
};

const getServiceIcon = (id: string) => {
  const props = { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case 'room_service': return <svg {...props}><path d="M6 18h12"/><path d="M12 2v2"/><path d="M2 18a10 10 0 0 1 20 0"/><path d="m12 4 7 14H5l7-14Z"/></svg>;
    case 'housekeeping': return <svg {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="m9 11 1 1 1-1"/><path d="m13 11 1 1 1-1"/></svg>;
    case 'laundry': return <svg {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><circle cx="12" cy="13" r="3"/></svg>;
    case 'spa': return <svg {...props}><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="M12 20v2"/><path d="m17.66 17.66 1.41 1.41"/><path d="M20 12h2"/><path d="m17.66 6.34 1.41-1.41"/><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/></svg>;
    case 'cab': return <svg {...props}><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="7" cy="21" r="2"/><circle cx="17" cy="21" r="2"/><path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4"/></svg>;
    case 'wakeup': return <svg {...props}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="m5 3 2 2"/><path d="m19 3-2 2"/></svg>;
    case 'wifi': return <svg {...props}><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
  }
};

const MENU_CATS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts', 'Specials'];

export default function GuestPage({ params }: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = use(params);
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [tab, setTab] = useState<'menu' | 'services'>('services');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Guest info
  const [roomNumber, setRoomNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [infoSet, setInfoSet] = useState(false);

  // States
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    console.log('Guest Portal Loading for Hotel:', hotelId);
    const load = async () => {
      try {
        const hotelDoc = await getDoc(doc(db, 'hotels', hotelId));
        if (!hotelDoc.exists()) { 
          console.error('Hotel Not Found in DB:', hotelId);
          setNotFound(true); 
          return; 
        }
        console.log('Hotel Loaded Successfully:', hotelDoc.data()?.name);
        setHotel({ id: hotelDoc.id, ...hotelDoc.data() } as HotelData);
      } catch (err: any) {
        console.error('Firestore Error:', err.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hotelId]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const cartTotal = cart.reduce((sum, i) => sum + (parseFloat(i.price) * i.qty), 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const placeOrder = async () => {
    if (!roomNumber || !guestName) return;
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const items = cart.map(i => `${i.name} x${i.qty}`);
      await addDoc(collection(db, 'orders'), {
        hotelId,
        roomNumber,
        guestName,
        type: 'food',
        items,
        total: cartTotal.toFixed(0),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      // Send Notification
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId,
          type: 'food',
          roomNumber,
          guestName,
          items,
          total: cartTotal.toFixed(0),
        }),
      }).catch(err => console.error('Notification failed:', err));

      setCart([]);
      setCartOpen(false);
      setSuccess('✅ Order placed! We\'ll bring it to your room shortly.');
      setTimeout(() => setSuccess(''), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const requestService = async (serviceId: string) => {
    if (!roomNumber || !guestName) return;
    setSubmitting(true);
    setSelectedService(serviceId);
    try {
      const label = hotel?.customServiceLabels?.[serviceId] || SERVICE_LABELS[serviceId] || serviceId;
      await addDoc(collection(db, 'orders'), {
        hotelId,
        roomNumber,
        guestName,
        type: 'service',
        service: label,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      // Send Notification
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId,
          type: 'service',
          roomNumber,
          guestName,
          service: label,
        }),
      }).catch(err => console.error('Notification failed:', err));

      setSuccess(`✅ ${label} requested! Our team will be with you soon.`);
      setTimeout(() => setSuccess(''), 5000);
    } finally {
      setSubmitting(false);
      setSelectedService('');
    }
  };

  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoadError(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 20px' }} />
          {loadError && (
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', maxWidth: '280px' }}>
              Still loading... If you are on mobile and using &apos;localhost&apos;, this page won&apos;t load. 
              Please check your connection or deploy the app.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (notFound || !hotel) {
    return (
      <div className={styles.notFound}>
        <span>😕</span>
        <h2>Hotel Not Found</h2>
        <p>This QR code is invalid or the hotel may have been removed.</p>
        <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '20px' }}>
          URL ID: <code style={{ color: 'var(--mid)' }}>{hotelId}</code>
        </p>
      </div>
    );
  }

  // Guest Info Screen
  if (!infoSet) {
    return (
      <div className={styles.guestInfoPage}>
        <div className={styles.guestInfoCard}>
          <div className={styles.hotelBadge}>🏨</div>
          <h2 className={styles.hotelTitle}>{hotel.name}</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '32px', textAlign: 'center' }}>
            {hotel.city} · Welcome! Please enter your details to continue.
          </p>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input className="form-input" placeholder="e.g. Ravi Shah" value={guestName} onChange={e => setGuestName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Room Number</label>
              <input className="form-input" placeholder="e.g. 201" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              onClick={() => { if (roomNumber && guestName) setInfoSet(true); }}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.guestPage}>
      {/* Header Hero */}
      <header className={styles.headerHero} style={{ backgroundImage: `linear-gradient(to bottom, rgba(13,13,18,0.5), rgba(13,13,18,0.9)), url('/v4-logo.png')` }}>
        <div className={styles.headerContentWrapper}>
          <h1 className={styles.headerTitle}>{hotel.name}</h1>
          <div className={styles.headerSub}>Room {roomNumber} • {guestName}</div>
        </div>
      </header>

      {/* Success Toast */}
      {success && (
        <div className="toast toast-success" style={{ position: 'fixed', top: 16, left: 16, right: 16, textAlign: 'center', zIndex: 9999 }}>
          {success}
        </div>
      )}

      {/* Main Grid View */}
      <div className={styles.servicesContent}>
        <div className={styles.servicesGrid}>
          {/* Restaurant / Dining */}
          {(hotel.services.includes('restaurant') || (hotel.menu && hotel.menu.length > 0)) && (
            <button 
              className={`${styles.svcCard} ${styles.foodCard}`}
              onClick={() => setTab('menu')}
            >
              <div className={styles.svcIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
              </div>
              <span className={styles.svcLabel}>Order Food</span>
              <span className={styles.svcSub}>Delicious meals to your room</span>
            </button>
          )}

          {/* Billing Request */}
          <button
            className={`${styles.svcCard} ${styles.billCard}`}
            onClick={() => requestService('billing_request')}
            style={{ border: '1px solid rgba(109,40,217,.2)', background: 'linear-gradient(135deg, rgba(109,40,217,.05) 0%, rgba(109,40,217,.1) 100%)' }}
            disabled={submitting && selectedService === 'billing_request'}
          >
            <div className={styles.svcIconWrapper} style={{ color: '#8b5cf6' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span className={styles.svcLabel}>Request Bill</span>
            <span className={styles.svcSub}>Checkout or settle dues</span>
            {submitting && selectedService === 'billing_request' && <span className="spinner" style={{ width: 16, height: 16 }} />}
          </button>

          {/* WiFi Info */}
          {(hotel.wifiName || hotel.wifiPassword) && (
            <div className={`${styles.svcCard} ${styles.wifiCard}`} style={{ cursor: 'default' }}>
              <div className={styles.svcIconWrapper} style={{ color: '#0ea5e9' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/></svg>
              </div>
              <span className={styles.svcLabel}>Guest WiFi</span>
              <div style={{ marginTop: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 600 }}>SSID: {hotel.wifiName || 'Hotel_Guest'}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--text)', fontWeight: 700, marginTop: '2px' }}>PASS: {hotel.wifiPassword || 'None'}</div>
              </div>
            </div>
          )}

          {/* Amenities & Services */}
          {hotel.services.filter(s => s !== 'restaurant' && s !== 'wifi').map(svcId => (
            <button
              key={svcId}
              className={styles.svcCard}
              onClick={() => requestService(svcId)}
              disabled={submitting && selectedService === svcId}
            >
              <div className={styles.svcIconWrapper}>
                {getServiceIcon(svcId)}
              </div>
              <span className={styles.svcLabel}>{hotel?.customServiceLabels?.[svcId] || SERVICE_LABELS[svcId] || svcId}</span>
              <span className={styles.svcSub}>Instant request</span>
              {submitting && selectedService === svcId && <span className="spinner" style={{ width: 16, height: 16 }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Overlay (Shows only when Order Food is selected) */}
      {tab === 'menu' && (
        <div className={styles.menuOverlay}>
          <div className={styles.menuOverlayHeader}>
            <button className={styles.backBtn} onClick={() => setTab('services')}>← Back to Services</button>
            <h2>Food &amp; Dining</h2>
          </div>
          <div className={styles.menuContent}>
            {MENU_CATS.filter(cat => hotel.menu.some(i => i.category === cat)).map(cat => (
              <div key={cat} className={styles.menuCat}>
                <div className={styles.menuCatTitle}>{cat}</div>
                {hotel.menu.filter(i => i.category === cat).map(item => {
                  const cartItem = cart.find(c => c.id === item.id);
                  return (
                    <div key={item.id} className={styles.menuItem}>
                      <div className={styles.menuItemInfo}>
                        <div className={styles.menuItemName}>{item.name}</div>
                        {item.description && <div className={styles.menuItemDesc}>{item.description}</div>}
                        <div className={styles.menuItemPrice}>₹{item.price}</div>
                      </div>
                      <div className={styles.menuItemQty}>
                        {cartItem ? (
                          <>
                            <button className={styles.qtyBtn} onClick={() => removeFromCart(item.id)}>−</button>
                            <span className={styles.qtyNum}>{cartItem.qty}</span>
                            <button className={styles.qtyBtn} onClick={() => addToCart(item)}>+</button>
                          </>
                        ) : (
                          <button className={styles.addBtn} onClick={() => addToCart(item)}>+ Add</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Button */}
      {tab === 'menu' && cartCount > 0 && !cartOpen && (
        <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
          🛒 View Cart ({cartCount}) · ₹{cartTotal.toFixed(0)}
        </button>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className={styles.cartDrawer}>
          <div className={styles.cartHeader}>
            <h3>Your Order</h3>
            <button onClick={() => setCartOpen(false)}>✕</button>
          </div>
          <div className={styles.cartItems}>
            {cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{item.name}</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>₹{item.price} × {item.qty}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button className={styles.qtyBtn} onClick={() => removeFromCart(item.id)}>−</button>
                  <span className={styles.qtyNum}>{item.qty}</span>
                  <button className={styles.qtyBtn} onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              <span>Total</span>
              <span>₹{cartTotal.toFixed(0)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={placeOrder} disabled={submitting}>
              {submitting ? <span className="spinner" /> : `Place Order →`}
            </button>
          </div>
        </div>
      )}

      {/* Call Reception */}
      {hotel.phone && (
        <div className={styles.reception}>
          <span>Need help?</span>
          <a href={`tel:${hotel.phone}`} className="btn btn-ghost btn-sm">📞 Call Reception</a>
        </div>
      )}
    </div>
  );
}
