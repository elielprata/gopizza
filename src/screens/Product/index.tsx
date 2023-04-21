import { Platform } from 'react-native'
import {
  Container,
  DeleteLabel,
  Header,
  PickImageButton,
  Title,
  Upload,
} from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { ButtonBack } from '@components/ButtonBack'
import { Photo } from '@components/Photo'

export function Product() {
  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header>
        <ButtonBack />

        <Title>Cadastrar</Title>

        <TouchableOpacity>
          <DeleteLabel>Deletar</DeleteLabel>
        </TouchableOpacity>
      </Header>

      <Upload>
        <Photo uri="" />

        <PickImageButton title="Carregar" type="secondary" />
      </Upload>
    </Container>
  )
}
