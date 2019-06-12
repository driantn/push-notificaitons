import Bowser from 'bowser';
const browser = Bowser.getParser(window.navigator.userAgent);

export default class BrowserUtils {
  static isBrowser() {
    return typeof window !== 'undefined';
  }

  static getRegistration(): Promise<ServiceWorkerRegistration | void> {
    return navigator.serviceWorker.getRegistration();
  }

  public isSafari(): boolean {
    return BrowserUtils.isBrowser() && this.getBrowser() === 'Safari';
  }

  public getBrowser(): string {
    if (BrowserUtils.isBrowser()) return browser.getBrowserName();
    return '';
  }

  public isPushNotificationSupported(): Boolean {
    if (
      BrowserUtils.isBrowser()
      && ('serviceWorker' in window.navigator)
      && ('PushManager' in window)
      && ('Notification' in window)
    ) return true;
    return false;
  }

  public urlBase64ToUint8Array(base64String: string): Uint8Array {
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

  public async registerServiceWorker(serviceWorkerUrl: string): Promise<void | ServiceWorkerRegistration> {
    const registration = await BrowserUtils.getRegistration();
    if (registration) return registration;
    return navigator.serviceWorker.register(serviceWorkerUrl).then((registration) => {
      console.log('log', 'Service worker successfully registered.');
      return registration;
    }).catch((err) => {
      console.error('Unable to register service worker.', err);
    });
  }
}