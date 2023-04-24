import { useCallback, useEffect, useState } from 'react'

import { Container, Header, Title } from './styles'
import { FlatList } from 'react-native'

import { OrderCard, OrderProps } from '@components/OrderCard'
import { ItemSeparator } from '@components/ItemSeparator'
import { useFocusEffect } from '@react-navigation/native'
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { firestore } from '../../../firebaseConfig'
import { useAuth } from '@hooks/auth'
import { Alert } from 'react-native'

export function Orders() {
  const [orders, setOrders] = useState<OrderProps[]>([])

  const { user } = useAuth()

  function handlePizzaDelivered(id: string) {
    const alertMessage = user?.isAdmin
      ? 'Confirmar que pizza esta pronta?'
      : 'Confirmar que pizza foi entregue?'
    Alert.alert('Pedido', alertMessage, [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: () => {
          user?.isAdmin
            ? updateDoc(doc(firestore, 'orders', id), { status: 'Pronto' })
            : updateDoc(doc(firestore, 'orders', id), { status: 'Entregue' })
        },
      },
    ])
  }

  async function fetchOrders() {
    try {
      const qWaiter = query(
        collection(firestore, 'orders'),
        where('waiter_id', '==', user?.id)
      )

      const qAdmin = collection(firestore, 'orders')

      const querySelected = user?.isAdmin ? qAdmin : qWaiter

      const unsubscribe = onSnapshot(querySelected, (queryResponse) => {
        const ordersData = queryResponse.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as OrderProps[]

        setOrders(ordersData)
      })

      return () => unsubscribe
    } catch (error) {}
  }

  useFocusEffect(
    useCallback(() => {
      fetchOrders()
    }, [])
  )

  return (
    <Container>
      <Header>
        <Title>Pedidos Feitos</Title>
      </Header>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <OrderCard
            index={index}
            data={item}
            disabled={item.status === 'Entregue'}
            onPress={() => handlePizzaDelivered(item.id)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />
    </Container>
  )
}
