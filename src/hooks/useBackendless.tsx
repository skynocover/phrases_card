import React, { useState, useEffect } from 'react';
import Backendless from 'backendless';

interface BackendlessContextProps {
  currentUser: Backendless.User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<Backendless.User | undefined>>;
}

const BackendlessContext = React.createContext<BackendlessContextProps>(undefined!);

interface BackendlessProviderProps {
  subDomain: string;
  children: React.ReactNode;
}

const BackendlessProvider = ({ subDomain, children }: BackendlessProviderProps) => {
  const [currentUser, setCurrentUser] = useState<Backendless.User | undefined>();

  const init = async () => {
    try {
      Backendless.initApp(subDomain);
      const user = await Backendless.UserService.getCurrentUser();
      console.log({ user });
      setCurrentUser(user);
    } catch (error) {}
  };

  React.useEffect(() => {
    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /////////////////////////////////////////////////////

  return (
    <BackendlessContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </BackendlessContext.Provider>
  );
};

function useBackendless() {
  const [error, setError] = useState<Error>();

  const ctx = React.useContext(BackendlessContext);

  const getCurrentUser = async () => {
    const user = await Backendless.UserService.getCurrentUser();
    ctx.setCurrentUser(user);
    return user;
  };

  const register = async (email: string, password: string) => {
    const user = new Backendless.User();
    user.email = email;
    user.password = password;
    const userRegistered = await Backendless.UserService.register(user);
    return userRegistered;
  };

  const googleLogin = async (token: string) => {
    try {
      const loggedInUser = await Backendless.UserService.loginWithOauth2(
        'googleplus',
        token,
        undefined,
        undefined,
        true,
      );
      ctx.setCurrentUser(loggedInUser);
    } catch (error: any) {
      setError(error);
    }
  };

  const emailLogin = async (email: string, password: string) => {
    const loggedInUser = await Backendless.UserService.login(email, password, true);
    ctx.setCurrentUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    await Backendless.UserService.logout();
    ctx.setCurrentUser(undefined);
  };

  return {
    getCurrentUser,
    register,
    emailLogin,
    googleLogin,
    logout,
    error,
  };
}

export { BackendlessProvider, BackendlessContext, useBackendless };
