import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'styled-components/native'

import { Home } from '@screens/Home'
import { Orders } from '@screens/Orders'
import { Platform } from 'react-native'
import { BottomMenu } from '@components/BottomMenu'
import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'

const { Navigator, Screen } = createBottomTabNavigator()

export function UserTabRoutes() {
  const [notifications, setNotifications] = useState('0')

  const { COLORS } = useTheme()

  useEffect(() => {
    const q = query(
      collection(firestore, 'orders'),
      where('status', '==', 'Pronto')
    )
    const subscribe = onSnapshot(q, (querySnapshot) =>
      setNotifications(String(querySnapshot.docs.length))
    )

    return () => subscribe()
  }, [])

  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.SECONDARY_900,
        tabBarInactiveTintColor: COLORS.SECONDARY_400,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
        },
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Cardápio" color={color} />
          ),
        }}
      />

      <Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu
              title="Pedidos"
              color={color}
              notifications={notifications}
            />
          ),
        }}
      />
    </Navigator>
  )
}
