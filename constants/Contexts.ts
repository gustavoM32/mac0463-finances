import React from "react";

export const AuthContext = React.createContext<{ signIn: any }>({signIn: undefined});
export const UserInfoContext = React.createContext<{ userInfo: any }>({userInfo: undefined});