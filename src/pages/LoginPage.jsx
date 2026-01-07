import React, { useState } from 'react'
import { Card, Form, Input, Button, Typography, Flex, App as AntdApp } from 'antd'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import './LoginPage.css'

const { Title, Text } = Typography

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { message } = AntdApp.useApp() // ✅ Hook officiel

  const handleFinish = async (values) => {
    setLoading(true)
    try {
      await login(values.username, values.password)
      message.success('Connexion réussie ✅')
      navigate('/mariages', { replace: true })
    } catch (err) {
      message.error('Impossible de se connecter. Vérifiez vos identifiants. ❌')
      console.error('Login failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-illustration">
        <div className="overlay">
          <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
            Système de Gestion des Mariages
          </Title>
          <Text style={{ color: 'white', fontSize: 16 }}>
            Connectez-vous pour gérer les dossiers et les cérémonies.
          </Text>
        </div>
      </div>

      <Flex align="center" justify="center" className="login-form-section">
        <Card variant={false} className="login-card">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img src="/logo.jpg" alt="Logo" width="80" style={{ marginBottom: 12 }} />
            <Title level={3} style={{ margin: 0 }}>Connexion</Title>
            <Text type="secondary">Accédez à votre espace</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              label="Nom d'utilisateur"
              rules={[{ required: true, message: 'Veuillez entrer votre identifiant' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="ex: admin" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mot de passe"
              rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
            </Form.Item>

            <Form.Item style={{ marginTop: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Se connecter
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Flex>
    </div>
  )
}
