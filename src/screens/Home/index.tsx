import { useCallback, useState } from 'react'
import {
  Container,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Header,
  MenuHeader,
  MenuItemsNumber,
  MenuTitle,
  NewProductButton,
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
import { FlatList } from 'react-native-gesture-handler'
import { firestore } from '../../../firebaseConfig'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import HappyEmojiPng from '../../assets/happy.png'

import { useAuth } from '@hooks/auth'

import { Search } from '@components/Search'
import { ProductCard, ProductProps } from '@components/ProductCard'

export function Home() {
  const [pizzas, setPizzas] = useState<ProductProps[]>([])
  const [search, setSearch] = useState('')

  const { COLORS } = useTheme()
  const navigation = useNavigation()
  const { user, signOut } = useAuth()

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

  function handleSearch() {
    fetchPizzas(search)
  }

  function handleSearchClear() {
    setSearch('')
    fetchPizzas('')
  }

  function handleOpen(id: string) {
    const route = user?.isAdmin ? 'product' : 'order'
    navigation.navigate(route, { id })
  }

  function handleAdd() {
    navigation.navigate('product', {})
  }

  useFocusEffect(
    useCallback(() => {
      fetchPizzas('')
    }, [])
  )

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={HappyEmojiPng} />
          <GreetingText>Olá, {user?.name}</GreetingText>
        </Greeting>

        <TouchableOpacity onPress={signOut}>
          <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
        </TouchableOpacity>
      </Header>

      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <MenuTitle>Cardápio</MenuTitle>
        <MenuItemsNumber>{pizzas.length} pizzas</MenuItemsNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpen(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24,
        }}
      />

      {user?.isAdmin && (
        <NewProductButton
          title="Cadastrar Pizza"
          type="secondary"
          onPress={handleAdd}
        />
      )}
    </Container>
  )
}
