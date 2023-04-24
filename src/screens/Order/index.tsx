import { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Alert, Platform } from 'react-native'
import {
  Container,
  ContentScroll,
  Form,
  FormRow,
  Header,
  InputGroup,
  Label,
  Photo,
  Price,
  Sizes,
  Title,
} from './styles'

import { ButtonBack } from '@components/ButtonBack'
import { RadioButton } from '@components/RadioButton'
import { Input } from '@components/Input'

import { PIZZA_TYPES } from '@utils/pizzaTypes'
import { Button } from '@components/Button'

import { OrderNavigationProps } from 'src/@types/navigation'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '../../../firebaseConfig'
import { ProductProps } from '@components/ProductCard'
import { useAuth } from '@hooks/auth'

type PizzaResponse = ProductProps & {
  price_sizes: {
    [key: string]: number
  }
}

export function Order() {
  const [size, setSize] = useState('')
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse)
  const [quantity, setQuantity] = useState(1)
  const [tableNumber, setTableNumber] = useState('')
  const [sendingOrder, setSendingOrder] = useState(false)

  const { user } = useAuth()
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params as OrderNavigationProps

  const amount = size ? pizza.price_sizes[size] * quantity : '0.00'

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleOrder() {
    if (!size) {
      return Alert.alert('Pedido', 'Selecione o tamanho da pizza.')
    }

    if (!tableNumber) {
      return Alert.alert('Pedido', 'Informe o número da mesa.')
    }

    if (!quantity) {
      return Alert.alert('Pedido', 'Informe a quantidade.')
    }

    setSendingOrder(true)

    try {
      await setDoc(doc(collection(firestore, 'orders')), {
        quantity,
        amount,
        pizza: pizza.name,
        size,
        table_number: tableNumber,
        status: 'Preparando',
        waiter_id: user?.id,
        image: pizza.photo_url,
      })

      navigation.navigate('home')
    } catch (error) {
      Alert.alert('Pedido', 'Não foi possível realizar o pedido.')
      setSendingOrder(false)
    }
  }

  async function getPizzaData() {
    try {
      const pizzaResponse = await getDoc(doc(firestore, 'pizzas', id))

      setPizza(pizzaResponse.data() as PizzaResponse)
    } catch (error) {
      return Alert.alert('Pedido', 'Não foi possível carregar o produto.')
    }
  }

  useEffect(() => {
    getPizzaData()
  }, [id])

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ContentScroll>
        <Header>
          <ButtonBack onPress={handleGoBack} style={{ marginBottom: 108 }} />
        </Header>
        <Photo source={{ uri: pizza.photo_url }} />

        <Form>
          <Title>{pizza.name}</Title>
          <Label>Selecione o tamanho</Label>
          <Sizes>
            {PIZZA_TYPES.map((item) => (
              <RadioButton
                key={item.id}
                title={item.name}
                selected={size === item.id}
                onPress={() => setSize(item.id)}
              />
            ))}
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>

              <Input keyboardType="numeric" onChangeText={setTableNumber} />
            </InputGroup>

            <InputGroup>
              <Label>Quantidade</Label>

              <Input
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={(value) => setQuantity(Number(value))}
              />
            </InputGroup>
          </FormRow>

          <Price>Valor de R$ {amount}</Price>

          <Button
            title="Confirmar pedido"
            onPress={handleOrder}
            isLoading={sendingOrder}
          />
        </Form>
      </ContentScroll>
    </Container>
  )
}
