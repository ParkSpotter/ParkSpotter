export type LoginViewModel = {
  email: string
  password: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setPassword: React.Dispatch<React.SetStateAction<string>>
  onSubmit: () => void
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}
