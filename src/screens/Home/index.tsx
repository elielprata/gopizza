import {
  Container,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Header,
  MenuHeader,
  MenuItemsNumber,
  MenuTitle,
} from './styles'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
} from 'firebase/firestore'
import { firestore } from '../../../firebaseConfig'

import HappyEmojiPng from '../../assets/happy.png'

import { Search } from '@components/Search'
import { ProductCard, ProductProps } from '@components/ProductCard'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'

export function Home() {
  const [pizzas, setPizzas] = useState<ProductProps[]>([])

  const { COLORS } = useTheme()

  async function fetchPizzas(value: string) {
    const formatedValue = value.toLowerCase().trim()

    const q = query(
      collection(firestore, 'pizzas'),
      orderBy('name_insensitive'),
      startAt(formatedValue),
      endAt(`${formatedValue}\uf8ff`)
    )

    const data = await getDocs(q)

    const products = data.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    }) as ProductProps[]

    setPizzas(products)
  }

  useEffect(() => {
    fetchPizzas('')
  }, [])

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

      <MenuHeader>
        <MenuTitle>Cardápio</MenuTitle>
        <MenuItemsNumber>10 pizzas</MenuItemsNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard data={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24,
        }}
      />
    </Container>
  )
}