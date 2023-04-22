import {
  Container,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Header,
} from './styles'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'

import HappyEmojiPng from '../../assets/happy.png'
import { Search } from '@components/Search'

export function Home() {
  const { COLORS } = useTheme()

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={HappyEmojiPng} />
          <GreetingText>Olá, Admin</GreetingText>
        </Greeting>

        <TouchableOpacity>
          <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
        </TouchableOpacity>
      </Header>

      <Search onSearch={() => {}} onClear={() => {}} />
    </Container>
  )
}
