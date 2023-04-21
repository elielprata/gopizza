import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as signOutFB,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type User = {
  id: string
  name: string
  isAdmin: boolean
}

type AuthContextData = {
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  isLogging: boolean
  user: User | null
}

type AuthProviderProps = {
  children: ReactNode
}

const USER_COLLECTION = '@gopizza:user'

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLogging, setIsLogging] = useState(false)

  const auth = getAuth()

  async function signIn(email: string, password: string) {
    if (!email || !password) {
      return Alert.alert('Login', 'Informe o e-mail e a senha')
    }

    setIsLogging(true)

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

          await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(userData))
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

  async function loadUserStorageData() {
    setIsLogging(true)

    const storedUser = await AsyncStorage.getItem(USER_COLLECTION)

    if (storedUser) {
      const userData = JSON.parse(storedUser) as User

      setUser(userData)
    }

    setIsLogging(false)
  }

  async function signOut() {
    await signOutFB(auth)
    await AsyncStorage.removeItem(USER_COLLECTION)
    setUser(null)
  }

  async function forgotPassword(email: string) {
    if (!email) {
      return Alert.alert('Redefinir senha', 'Informe o e-mail.')
    }

    sendPasswordResetEmail(auth, email)
      .then(() =>
        Alert.alert(
          'Redefinir senha',
          'Enviamos um link no seu e-mail para redefinir sua senha.'
        )
      )
      .catch(() =>
        Alert.alert(
          'Redefinir senha',
          'Não foi possível enviar o e-mail para redefinir sua senha.'
        )
      )
  }

  useEffect(() => {
    loadUserStorageData()
  }, [])

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, forgotPassword, isLogging, user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }
