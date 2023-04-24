import { TouchableOpacityProps } from 'react-native'
import {
  Container,
  Description,
  Image,
  Name,
  StatusContainer,
  StatusLabel,
} from './styles'

type Props = TouchableOpacityProps & {
  index: number
}

export function OrderCard({ index, ...rest }: Props) {
  return (
    <Container index={index} {...rest}>
      <Image source={{ uri: 'https://github.com/elielprata.png' }} />

      <Name>Nome da Pizza</Name>

      <Description>Mesa 5 {'🞄'} Qnt: 1</Description>

      <StatusContainer status="Preparando">
        <StatusLabel status="Preparando">Preparando</StatusLabel>
      </StatusContainer>
    </Container>
  )
}
