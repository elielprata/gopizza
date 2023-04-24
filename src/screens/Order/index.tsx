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
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '../../../firebaseConfig'
import { ProductProps } from '@components/ProductCard'

type PizzaResponse = ProductProps & {
  price_sizes: {
    [key: string]: number
  }
}

export function Order() {
  const [size, setSize] = useState('')
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse)

  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params as OrderNavigationProps

  function handleGoBack() {
    navigation.goBack()
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

              <Input keyboardType="numeric" />
            </InputGroup>

            <InputGroup>
              <Label>Quantidade</Label>

              <Input keyboardType="numeric" />
            </InputGroup>
          </FormRow>

          <Price>Valor de R$ 50.00</Price>

          <Button title="Confirmar pedido" />
        </Form>
      </ContentScroll>
    </Container>
  )
}
