import { useState } from 'react'
import { Button } from '@components/Button'
import {
  Container,
  Content,
  Title,
  Brand,
  ForgotPasswordButton,
  ForgotPasswordLabel,
} from './styles'

import { Input } from '@components/Input'
import { KeyboardAvoidingView, Platform } from 'react-native'

import BrandImg from '@assets/brand.png'
import { useAuth } from '@hooks/auth'

export function SignIn() {
  const [email, setEmail] = useState('garcom@restaurante.com')
  const [password, setPassword] = useState('123456')

  const { signIn, isLogging } = useAuth()

  function handleSignIn() {
    signIn(email, password)
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Content>
          <Brand source={BrandImg} />

          <Title>Login</Title>

          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            placeholder="Senha"
            type="secondary"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <ForgotPasswordButton>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPasswordButton>

          <Button
            title="Entrar"
            type="secondary"
            isLoading={isLogging}
            onPress={handleSignIn}
          />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  )
}
