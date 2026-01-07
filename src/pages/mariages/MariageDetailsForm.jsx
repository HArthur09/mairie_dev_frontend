import React from 'react'
import { Form, Input, DatePicker, TimePicker } from 'antd'

export default function MariageDetailsForm({ data, setData, formRefs }) {
  const [form] = Form.useForm()

  const onValuesChange = (_, allValues) => {
    setData(prev => ({ ...prev, ...allValues }))
  }

  return (
    <Form
      form={form}
      layout="vertical"
      ref={ref => { formRefs.current['homme'] = form }}
      onValuesChange={onValuesChange}
      initialValues={data}
    >
      <Form.Item name="date_celebration" label="Date de célébration">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="heure_celebration" label="Heure de célébration">
        <TimePicker format="HH:mm" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="lieu_celebration" label="Lieu de célébration">
        <Input />
      </Form.Item>
      <Form.Item name="nom_maire" label="Nom du Maire">
        <Input />
      </Form.Item>
      <Form.Item name="fait_à" label="Fait à">
        <Input />
      </Form.Item>
    </Form>
  )
}
