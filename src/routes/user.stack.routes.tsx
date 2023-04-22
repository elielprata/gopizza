import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '@screens/Home'
import { Order } from '@screens/Order'
import { Product } from '@screens/Product'

const { Navigator, Screen } = createNativeStackNavigator()

export function UserStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="order" component={Order} />
      <Screen name="home" component={Home} />

      <Screen name="product" component={Product} />
    </Navigator>
  )
}
