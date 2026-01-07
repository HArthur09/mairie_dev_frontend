// src/App.js
import React, { useEffect, useState } from 'react'
import { Layout, Typography, Button, Grid, Drawer, Menu } from 'antd'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { MenuOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import AppRoutes from './routes/AppRoutes'
import { logout, getUserFromToken } from './api/auth'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { useBreakpoint } = Grid

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const screens = useBreakpoint()

  const [user, setUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // ✅ Récupérer les infos de l'utilisateur depuis le token JWT
  useEffect(() => {
    const userData = getUserFromToken()
    if (userData) setUser(userData)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isLoginPage = location.pathname === '/login'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ✅ Header visible uniquement si on n’est pas sur /login */}
      {!isLoginPage && (
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: '#001529',
          }}
        >
          {/* --- Gauche : logo + menu ou icône mobile --- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              Administration - Mariages
            </Title>

            {/* Menu desktop */}
            {screens.md && (
              <nav style={{ display: 'flex', gap: 24 }}>
                <Link
                  to="/mariages"
                  style={{
                    color: '#fff',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  Liste des mariages
                </Link>
                <Link
                  to="/mariages/create"
                  style={{
                    color: '#fff',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  Nouveau mariage
                </Link>
              </nav>
            )}

            {/* Menu mobile (icône burger) */}
            {!screens.md && (
              <Button
                type="text"
                icon={<MenuOutlined style={{ color: 'white', fontSize: 20 }} />}
                onClick={() => setDrawerOpen(true)}
              />
            )}
          </div>

          {/* --- Droite : utilisateur + déconnexion --- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {user && (
              <Text style={{ color: '#fff' }}>
                <UserOutlined /> {user.username || user.name}
              </Text>
            )}
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>

          {/* Drawer mobile */}
          <Drawer
            title="Menu"
            placement="left"
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            bodyStyle={{ padding: 0 }}
          >
            <Menu
              mode="inline"
              onClick={() => setDrawerOpen(false)}
              items={[
                { key: 'list', label: <Link to="/mariages">Liste des mariages</Link> },
                { key: 'create', label: <Link to="/mariages/create">Nouveau mariage</Link> },
              ]}
            />
          </Drawer>
        </Header>
      )}

      <Content style={{ padding: 24 }}>
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Content>
    </Layout>
  )
}
