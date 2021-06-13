import { useContext, createContext } from 'react'

export const CurrentUserContext = createContext()
export const AuthContext = createContext()

export const useCurrentUser = () => {
  return useContext(CurrentUserContext)
}

export const useAuthContext = () => {
  return useContext(AuthContext)
}
