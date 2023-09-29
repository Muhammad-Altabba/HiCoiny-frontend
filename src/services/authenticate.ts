import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { RegisteredUser, constructRegisteredUser } from '../common/interfaces';

const appConfig = new AppConfig(['store_write']);
const userSession = new UserSession({ appConfig });

export async function authenticate(): Promise<RegisteredUser | undefined> {
  console.log('userSession', userSession);
  try {
    let userData = userSession.loadUserData();
    console.log(
      'User has been authenticated',
      constructRegisteredUser(userData)
    );
    return constructRegisteredUser(userData);
  } catch (error) {
    // try again after 1 second because sometimes the wallet is available but not yet injected in the browser.
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      let userData = userSession.loadUserData();
      console.log(
        'User has been authenticated',
        constructRegisteredUser(userData)
      );
      return constructRegisteredUser(userData);
    } catch (error) {}

    //No user data found. Did the user sign in?
    return new Promise(
      (
        resolve: (value: RegisteredUser | undefined) => void,
        reject: (reason?: any) => void
      ) => {
        showConnect({
          appDetails: {
            name: 'Hi(gh) Coiny (based on Bitcoin)',
            icon: window.location.origin + '/icons8-bitcoin-64.png',
          },
          redirectTo: '/',
          onCancel: () => {
            console.warn('user canceled!');
            resolve(undefined);
          },
          onFinish: () => {
            let userData = userSession.loadUserData();
            console.log('userData', userData);
            resolve(constructRegisteredUser(userData));
          },
          userSession: userSession,
        });
      }
    );
  }
}
