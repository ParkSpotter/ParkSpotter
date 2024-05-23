export type RegisterViewModel = {
  email: string
  password: string
  username: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setPassword: React.Dispatch<React.SetStateAction<string>>
  setUserName: React.Dispatch<React.SetStateAction<string>>
  onSubmit: () => void
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}
