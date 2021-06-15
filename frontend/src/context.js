import { useContext, createContext } from 'react'
import { useLocation } from 'react-router-dom'

export const CurrentUserContext = createContext()
export const AuthContext = createContext()

export const useCurrentUser = () => {
  return useContext(CurrentUserContext)
}

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}
