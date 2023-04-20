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

export function SignIn() {
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
          />

          <Input placeholder="Senha" type="secondary" secureTextEntry />

          <ForgotPasswordButton>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPasswordButton>

          <Button title="Entrar" type="secondary" />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  )
}
