import { Platform } from 'react-native'
import { Container, DeleteLabel, Header, Title } from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'

export function Product() {
  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header>
        <Title>Cadastrar</Title>
        <TouchableOpacity>
          <DeleteLabel>Deletar</DeleteLabel>
        </TouchableOpacity>
      </Header>
    </Container>
  )
}
