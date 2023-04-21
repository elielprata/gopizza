import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, documentId, getDoc, where } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'
import { ReactNode, createContext, useContext, useState } from 'react'
import { Alert } from 'react-native'

type User = {
  id: string
  name: string
  isAdmin: boolean
}

type AuthContextData = {
  signIn: (email: string, password: string) => Promise<void>
  isLogging: boolean
  user: User | null
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLogging, setIsLogging] = useState(false)

  async function signIn(email: string, password: string) {
    if (!email || !password) {
      return Alert.alert('Login', 'Informe o e-mail e a senha')
    }

    setIsLogging(true)

    const auth = getAuth()

    signInWithEmailAndPassword(auth, email, password)
      .then(async (account) => {
        const docRef = doc(firestore, 'users', account.user.uid)
        const profile = await getDoc(docRef)

        if (profile.exists()) {
          const { name, isAdmin } = profile.data() as User

          const userData = {
            id: account.user.uid,
            name,
            isAdmin,
          }

          setUser(userData)
        } else {
          return Alert.alert(
            'Login',
            'Não foi possível buscar os dados de perfil do usuário.'
          )
        }
      })
      .catch((error) => {
        const { code } = error

        if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
          return Alert.alert('Login', 'E-mail e/ou senha inválida.')
        } else {
          return Alert.alert('Login', 'Não foi possível realizar o login.')
        }
      })
      .finally(() => setIsLogging(false))
  }

  return (
    <AuthContext.Provider value={{ signIn, isLogging, user }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }
