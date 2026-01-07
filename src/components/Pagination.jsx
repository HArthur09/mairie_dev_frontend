import React from 'react'
import { Pagination } from 'antd'

export default function SimplePagination({ current, total, pageSize, onChange }) {
  return (
    <Pagination current={current} total={total} pageSize={pageSize} onChange={onChange} />
  )
}
