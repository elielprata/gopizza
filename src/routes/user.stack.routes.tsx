import { useAuth } from '@hooks/auth'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '@screens/Home'
import { Product } from '@screens/Product'
import { UserTabRoutes } from './user.tab.routes'

const { Navigator, Screen, Group } = createNativeStackNavigator()

export function UserStackRoutes() {
  const { user } = useAuth()

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {user?.isAdmin ? (
        <Group>
          <Screen name="home" component={Home} />

          <Screen name="product" component={Product} />
        </Group>
      ) : (
        <Group>
          <Screen name="home" component={UserTabRoutes} />

          <Screen name="product" component={Product} />
        </Group>
      )}
    </Navigator>
  )
}
