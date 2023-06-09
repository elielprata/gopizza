import { TouchableOpacityProps } from 'react-native'
import { Container, Load, Title, TypeProps } from './styles'

type Props = TouchableOpacityProps & {
  title: string
  type?: TypeProps
  isLoading?: boolean
}

export function Button({ title, type = 'primary', isLoading, ...rest }: Props) {
  return (
    <Container type={type} disabled={isLoading} {...rest}>
      {isLoading ? <Load /> : <Title>{title}</Title>}
    </Container>
  )
}
