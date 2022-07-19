import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDBMgUudhJSPHdnurUrIyR0PrV7Nq6bN80',
  authDomain: 'phrasecards-8618d.firebaseapp.com',
  projectId: 'phrasecards-8618d',
  storageBucket: 'phrasecards-8618d.appspot.com',
  messagingSenderId: '244012513904',
  appId: '1:244012513904:web:046fad9f3aaa58b84c52b5',
  measurementId: 'G-VPCBDJ17J6',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();

const googleLogin = async (): Promise<string | undefined> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (credential) {
      const token = credential.accessToken;
      // const user = result.user;

      return token;
    } else {
      console.log('no credential');
    }
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log({ errorCode, errorMessage });
  }
};

const logout = async () => {
  await signOut(auth);
};

export { googleLogin, logout };
