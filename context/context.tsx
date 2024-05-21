import { User } from 'firebase/auth'
import { useState } from 'react'
import { createContext } from 'react'

type ContextType = {
  user: User
  setUser: (user: User) => void
}

export const Context = createContext({} as ContextType)

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState({} as User)

  return (
    <Context.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  )
}
