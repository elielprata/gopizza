import { useEffect, useState } from 'react'
import { Alert, Platform, ScrollView } from 'react-native'
import {
  Container,
  DeleteLabel,
  Form,
  Header,
  InputGroup,
  InputGroupHeader,
  Label,
  MaxCharacters,
  PickImageButton,
  Title,
  Upload,
} from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { firestore, storage } from '../../../firebaseConfig'
import { doc, addDoc, collection, getDoc } from 'firebase/firestore'

import { ProductNavigationProps } from '../../@types/navigation'

import { ButtonBack } from '@components/ButtonBack'
import { Photo } from '@components/Photo'
import { InputPrice } from '@components/InputPrice'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useRoute } from '@react-navigation/native'

import { ProductProps } from '@components/ProductCard'

type PizzaResponse = ProductProps & {
  photo_path: string
  price_sizes: {
    p: string
    m: string
    g: string
  }
}

export function Product() {
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priceSizeP, setPriceSizeP] = useState('')
  const [priceSizeM, setPriceSizeM] = useState('')
  const [priceSizeG, setPriceSizeG] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [photoPath, setPhotoPath] = useState('')

  const route = useRoute()
  const { id } = route.params as ProductNavigationProps

  async function handlePickerImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)
      }
    }
  }

  async function handleAdd() {
    if (!name.trim()) {
      return Alert.alert('Cadastro', 'Informe o nome da pizza.')
    }

    if (!description.trim()) {
      return Alert.alert('Cadastro', 'Informe a descrição da pizza.')
    }

    if (!image) {
      return Alert.alert('Cadastro', 'Selecione a imagem da pizza.')
    }

    if (!priceSizeP || !priceSizeM || !priceSizeG) {
      return Alert.alert(
        'Cadastro',
        'Informe o preço de todos os tamanhos da pizza.'
      )
    }

    setIsLoading(true)

    const fileName = new Date().getTime()
    const reference = ref(storage, `pizzas/${fileName}.png`)

    const response = await fetch(image)
    const blob = await response.blob()
    await uploadBytes(reference, blob)

    const photo_url = await getDownloadURL(reference)

    try {
      const docRef = await addDoc(collection(firestore, 'pizzas'), {
        name,
        name_insensitive: name.toLowerCase().trim(),
        description,
        price_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG,
        },
        photo_url,
        photo_path: reference.fullPath,
      })

      if (docRef.id) {
        return Alert.alert('Cadastro', 'Pizza cadastrada com sucesso.')
      }
    } catch (error) {
      return Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza.')
    } finally {
      setIsLoading(false)
    }
  }

  async function getPizza() {
    if (id) {
      const ref = doc(firestore, 'pizzas', id)
      const pizza = await getDoc(ref)

      if (pizza.exists()) {
        const { name, description, photo_url, price_sizes, photo_path } =
          pizza.data() as PizzaResponse

        setName(name)
        setDescription(description)
        setImage(photo_url)
        setPriceSizeP(price_sizes.p)
        setPriceSizeM(price_sizes.m)
        setPriceSizeG(price_sizes.g)
        setPhotoPath(photo_path)
      }
    }
  }

  useEffect(() => {
    getPizza()
  }, [id])

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack />

          <Title>Cadastrar</Title>

          <TouchableOpacity>
            <DeleteLabel>Deletar</DeleteLabel>
          </TouchableOpacity>
        </Header>

        <Upload>
          <Photo uri={image} />

          <PickImageButton
            title="Carregar"
            type="secondary"
            onPress={handlePickerImage}
          />
        </Upload>

        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input value={name} onChangeText={setName} />
          </InputGroup>

          <InputGroup>
            <InputGroupHeader>
              <Label>Descrição</Label>
              <MaxCharacters>0 de 60 Caracteres</MaxCharacters>
            </InputGroupHeader>

            <Input
              multiline
              maxLength={60}
              style={{ height: 80 }}
              value={description}
              onChangeText={setDescription}
            />
          </InputGroup>

          <InputGroup>
            <Label>Tamanhos e Preços</Label>
            <InputPrice
              size="P"
              value={priceSizeP}
              onChangeText={setPriceSizeP}
            />
            <InputPrice
              size="M"
              value={priceSizeM}
              onChangeText={setPriceSizeM}
            />
            <InputPrice
              size="G"
              value={priceSizeG}
              onChangeText={setPriceSizeG}
            />
          </InputGroup>

          <Button
            title="Cadastrar Pizza"
            isLoading={isLoading}
            onPress={handleAdd}
          />
        </Form>
      </ScrollView>
    </Container>
  )
}
