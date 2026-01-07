import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, TimePicker, Select, Button, Spin } from 'antd'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import api from '../api/axios'
import usePersonnes from '../hooks/usePersonnes'
import useDocumentMariage from '../hooks/useDocumentMariage'

const statusOptions = [
  { label: 'En attente', value: 'en_attente' },
  { label: 'Terminé', value: 'termine' },
  { label: 'Annulé', value: 'annule' },
]

export default function MariageForm({ visible, initialValues, onClose, onSaved }) {
  const [form] = Form.useForm()
  const { data: personnes, isLoading: loadingPersonnes } = usePersonnes()
  const { data: docs, isLoading: loadingDocs } = useDocumentMariage()

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          date_celebration: initialValues.date_celebration ? dayjs(initialValues.date_celebration) : null,
          heure_celebration: initialValues.heure_celebration ? dayjs(initialValues.heure_celebration, 'HH:mm:ss') : null,
          infos_maries: initialValues.infos_maries?.id ?? initialValues.infos_maries, // accommodate nested or id
          id_dossier: initialValues.id_dossier?.id ?? initialValues.id_dossier,
        })
      } else {
        form.resetFields()
      }
    }
  }, [visible, initialValues, form])

  const createMutation = useMutation((payload) => api.post('/mariages/', payload))
  const updateMutation = useMutation(({ id, payload }) => api.patch(`/mariages/${id}/`, payload))

  const onFinish = async (values) => {
    const payload = {
      ...values,
      date_celebration: values.date_celebration ? values.date_celebration.format('YYYY-MM-DD') : null,
      heure_celebration: values.heure_celebration ? values.heure_celebration.format('HH:mm:ss') : null,
    }

    try {
      if (initialValues && initialValues.id) {
        await updateMutation.mutateAsync({ id: initialValues.id, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onSaved()
      form.resetFields()
    } catch (err) {
      // handle validation errors: DRF renvoie souvent err.response.data
      const errData = err?.response?.data
      if (errData && typeof errData === 'object') {
        // map backend validation errors to form
        const fields = Object.entries(errData).map(([name, messages]) => ({
          name,
          errors: Array.isArray(messages) ? messages : [String(messages)],
        }))
        form.setFields(fields)
      }
    }
  }

  const isBusy = createMutation.isLoading || updateMutation.isLoading

  return (
    <Modal
      open={visible}
      title={initialValues ? 'Modifier mariage' : 'Nouveau mariage'}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="date_celebration" label="Date" rules={[{ required: true, message: 'Date requise' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="heure_celebration" label="Heure" rules={[{ required: true, message: 'Heure requise' }]}>
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="lieu_celebration" label="Lieu" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="nom_maire" label="Nom du maire" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="status" label="Statut" rules={[{ required: true }]}>
          <Select options={statusOptions} />
        </Form.Item>

        <Form.Item name="infos_maries" label="Personnes" rules={[{ required: true, message: 'Sélectionnez une personne' }]}>
          {loadingPersonnes ? (
            <Spin />
          ) : (
            <Select
              showSearch
              placeholder="Sélectionner une personne"
              optionFilterProp="label"
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={(personnes ?? []).map(p => ({
                label: `${p.nom ?? ''} ${p.prenom ?? ''}`.trim() || `#${p.id}`,
                value: p.id,
              }))}
            />
          )}
        </Form.Item>

        <Form.Item name="id_dossier" label="Document mariage" rules={[{ required: true, message: 'Sélectionner un document' }]}>
          {loadingDocs ? (
            <Spin />
          ) : (
            <Select
              showSearch
              placeholder="Sélectionner un document"
              optionFilterProp="label"
              options={(docs ?? []).map(d => ({
                label: d.titre ?? `Document #${d.id}`,
                value: d.id,
              }))}
            />
          )}
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Button onClick={() => { form.resetFields(); onClose() }} style={{ marginRight: 8 }}>
            Annuler
          </Button>
          <Button type="primary" htmlType="submit" loading={isBusy}>
            Enregistrer
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
