import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import type { Server } from 'miragejs'

export default function berkasFakeApi(server: Server, apiPrefix: string) {
    server.post(`${apiPrefix}/purchase-order`, (schema, { requestBody }) => {
        const body = JSON.parse(requestBody)
        const { pageIndex, pageSize, sort, query } = body
        const { order, key } = sort
        const berkases = schema.db.purchaseOrdersData
        const sanitizeBerkases = berkases.filter(
            (elm) => typeof elm !== 'function'
        )
        let data = sanitizeBerkases
        let total = berkases.length

        if ((key === 'category' || key === 'name') && order) {
            data.sort(
                sortBy(key, order === 'desc', (a) =>
                    (a as string).toUpperCase()
                )
            )
        } else {
            data.sort(sortBy(key, order === 'desc', parseInt as Primer))
        }

        if (query) {
            data = wildCardSearch(data, query)
            total = data.length
        }

        data = paginate(data, pageSize, pageIndex)

        const responseData = {
            data: data,
            total: total,
        }
        return responseData
    })

    server.del(
        `${apiPrefix}/purchase-order/delete`,
        (schema, { requestBody }) => {
            const { id } = JSON.parse(requestBody)
            schema.db.purchaseOrdersData.remove({ id })
            return true
        }
    )

    server.get(`${apiPrefix}/purchase-order`, (schema, { queryParams }) => {
        const id = queryParams.id
        const berkas = schema.db.purchaseOrdersData.find(id)
        return berkas
    })

    server.put(
        `${apiPrefix}/purchase-order/update`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            const { id } = data
            schema.db.purchaseOrdersData.update({ id }, data)
            return true
        }
    )

    server.post(
        `${apiPrefix}/purchase-order/create`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            schema.db.purchaseOrdersData.insert(data)
            return true
        }
    )
}
