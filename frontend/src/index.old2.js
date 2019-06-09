function registerServiceWorker() {
  return navigator.serviceWorker.register('sw.js');
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function subscribePush(registration) {
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array('BJ2zYDjFYIQQVmTu2F8Ppa05_QYPwMaYeAPQNJtownxLAZ7T0gtVw8gLQrwF2_BXQFkDCN2ST1mSfinvC3WhUSc')
  });
}

function registerPush() {
  return navigator.serviceWorker.ready.then((registration) => {
    return registration.pushManager.getSubscription().then(subscription => {
      if (subscription) return subscription;
      return subscribePush(registration);
    });
  });
}

registerServiceWorker().then(function() {
  console.log('log', 11111111);
  registerPush().then(function(sub) { console.log('log', JSON.stringify(sub)); });
});
