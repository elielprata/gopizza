import { Platform } from 'react-native'
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
import { useState } from 'react'
import { Button } from '@components/Button'

export function Order() {
  const [size, setSize] = useState('')

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ContentScroll>
        <Header>
          <ButtonBack onPress={() => {}} style={{ marginBottom: 108 }} />
        </Header>
        <Photo source={{ uri: 'https://github.com/elielprata.png' }} />

        <Form>
          <Title>Nome da Pizza</Title>
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
