importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBlhAq2WJC8dcUYkRrXk-rSwNPeRMRA-B8",
  authDomain: "hotel-saas-automation.firebaseapp.com",
  projectId: "hotel-saas-automation",
  storageBucket: "hotel-saas-automation.firebasestorage.app",
  messagingSenderId: "602799845845",
  appId: "1:602799845845:web:c9e3c3201c4c7c2ecd0d5c"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/v4-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
