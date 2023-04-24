import { OrderCard } from '@components/OrderCard'
import { Container, Header, Title } from './styles'
import { FlatList } from 'react-native'
import { ItemSeparator } from '@components/ItemSeparator'

export function Orders() {
  return (
    <Container>
      <Header>
        <Title>Pedidos Feitos</Title>
      </Header>

      <FlatList
        data={['1', '2', '3']}
        keyExtractor={(item, i) => item + i}
        renderItem={({ item, index }) => <OrderCard index={index} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />
    </Container>
  )
}
