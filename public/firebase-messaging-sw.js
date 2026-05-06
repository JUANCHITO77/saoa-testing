importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAHNtTnlpWMP0s-zTBvp_Moj1qhgn8Nay8",
    authDomain: "poc-push-notification-15488.firebaseapp.com",
    projectId: "poc-push-notification-15488",
    storageBucket: "poc-push-notification-15488.appspot.com",
    messagingSenderId: "204695003309",
    appId: "1:204695003309:web:ebbf1dbc87707746bee624",
    measurementId: "G-N2EM667ND6"
});

const messaging = firebase.messaging();

// Manejar notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("Notificación en segundo plano:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});