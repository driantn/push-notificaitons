import BrowserUtils from './BrowserUtils';
const utils = new BrowserUtils();

type SafariConfig = {
  webUrl: string;
  safariWebId: string;
  callBack?: Function;
  data?: object;
};

type SafariPermissionData = {
  permission: NotificationPermission;
};

export default class PermissionManager {
  static getSafariConfig(): SafariConfig {
    return {
      webUrl: window.location.href,
      safariWebId: 'someUUID',
    }
  }
  static getSafariUserPermission(safariConfig: SafariConfig): Promise<NotificationPermission> {
    return (<any>window).safari.pushNotification.requestPermission(
      safariConfig.webUrl,
      safariConfig.safariWebId,
      safariConfig.data,
      (permissionData: SafariPermissionData) => { return permissionData.permission }
    );
  }

  static getUserPermission(): Promise<NotificationPermission> {
    return Notification.requestPermission();
  }

  // TODO: check solution for safari
  async getNotificationPermission(): Promise<NotificationPermission> {
    let reportedPermission = 'default' as NotificationPermission;
    if (utils.isSafari())  {
      reportedPermission = await PermissionManager.getSafariUserPermission(PermissionManager.getSafariConfig());
    } else {
      reportedPermission = await PermissionManager.getUserPermission();
    }
    return reportedPermission;
  }

  // listenForPermissionChange = (registration) => {
  //   if ('permissions' in navigator) {
  //     navigator.permissions.query({ name:'notifications' })
  //       .then((notificationPermission) => {
  //         notificationPermission.onchange = async () => {
  //           console.log("User decided to change his seettings. New permission: " + notificationPermission.state);
  //           if (notificationPermission.state !== 'granted') {
  //             await this.unSubscribeUser(registration);
  //           }
  //         };
  //       });
  //   }
  // }
}