import React, { useState, useMemo } from 'react'
import { Table, Button, Space, Popconfirm, Input, App as AntdApp } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const fetchMariages = async ({ queryKey }) => {
  const [_key, { page, search }] = queryKey
  const params = { page, search, page_size: 10 }
  const { data } = await api.get('mairie/mariages/', { params })
  return data
}

export default function MariageList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { message } = AntdApp.useApp()

  // ✅ nouvelle syntaxe (v5)
  const { data, isLoading } = useQuery({
    queryKey: ['mariages', { page, search }],
    queryFn: fetchMariages,
    keepPreviousData: true,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/mairie/mariages/${id}/`),
    onSuccess: () => {
      message.success('Marriage Supprimé ✅')
      queryClient.invalidateQueries({ queryKey: ['mariages'] })
    },
    onError: () => message.error('Erreur suppression'),
  })

  const columns = useMemo(() => [
    {
      title: 'Date',
      dataIndex: 'date_celebration',
      key: 'date_celebration',
      render: (d) => (d ? dayjs(d).format('DD/MM/YYYY') : '-'),
    },
    { title: 'Heure', dataIndex: 'heure_celebration', key: 'heure_celebration' },
    { title: 'Lieu', dataIndex: 'lieu_celebration', key: 'lieu_celebration' },
    { title: 'Maire', dataIndex: 'nom_maire', key: 'nom_maire' },
    { title: 'Statut', dataIndex: 'status', key: 'status' },
    {
      title: 'Mariés',
      key: 'mariés',
      render: (_, record) => (
        `${record.infos_homme?.prenom ?? ''} ${record.infos_homme?.nom ?? ''} & ${record.infos_femme?.prenom ?? ''} ${record.infos_femme?.nom ?? ''}`
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/mariages/${record.id}`)}>Voir</Button>
          <Button onClick={() => navigate(`/mariages/${record.id}/edit`)}>Modifier</Button>
          <Popconfirm title="Supprimer ?" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button danger>Supprimer</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [deleteMutation, navigate])


  const handleSendPlanning = async () => {
    try {
      await api.post('mairie/envoyer-planning/')
      message.success('Planning hebdomadaire envoyé avec succès')
    } catch (error) {
      console.error(error)
      message.error("Échec de l'envoi du planning hebdomadaire")
    }
  }


  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Rechercher (maire, époux, épouse...)"
          allowClear
          onChange={(e) =>{
            if(e.target.value === ''){
              setSearch('')
              setPage(1);
            }
          }}
          onSearch={(val) => { setSearch(val); setPage(1) }}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => { navigate('/mariages/create') }}>
          Nouveau mariage
        </Button>
        <Button type="default" style={{backgroundColor:"darkseagreen", color:'white'}} onClick={handleSendPlanning}>
          Envoyer Planning Hebdo
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={Array.isArray(data) ? data : data?.results ?? []}
        columns={columns}
        pagination={
          Array.isArray(data) ? false : {
            current: page,
            pageSize: 10,
            total: data?.count ?? 0,
            onChange: (p) => setPage(p),
          }
        }
      />
    </div>
  )
}
