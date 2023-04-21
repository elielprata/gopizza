import { useFonts, DMSans_400Regular } from '@expo-google-fonts/dm-sans'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { ThemeProvider } from 'styled-components/native'

import theme from './src/theme'

import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '@hooks/auth'
import { Product } from '@screens/Product'

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSerifDisplay_400Regular,
  })

  if (!fontsLoaded) {
    return <></>
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <AuthProvider>
        <Product />
      </AuthProvider>
    </ThemeProvider>
  )
}
