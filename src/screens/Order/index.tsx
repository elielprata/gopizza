import { Platform } from 'react-native'
import { Container, Header, Photo, Sizes } from './styles'
import { ButtonBack } from '@components/ButtonBack'
import { RadioButton } from '@components/RadioButton'

export function Order() {
  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header>
        <ButtonBack onPress={() => {}} style={{ marginBottom: 108 }} />
      </Header>
      <Photo source={{ uri: 'https://github.com/elielprata.png' }} />

      <Sizes>
        <RadioButton title="Média" selected={false} />
        <RadioButton title="Grande" selected={true} />
      </Sizes>
    </Container>
  )
}
