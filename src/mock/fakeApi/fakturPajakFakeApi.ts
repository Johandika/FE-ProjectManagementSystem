import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import type { Server } from 'miragejs'

export default function berkasFakeApi(server: Server, apiPrefix: string) {
    server.post(`${apiPrefix}/faktur-pajak`, (schema, { requestBody }) => {
        const body = JSON.parse(requestBody)
        const { pageIndex, pageSize, sort, query } = body
        const { order, key } = sort
        const berkases = schema.db.fakturPajaksData
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
        `${apiPrefix}/faktur-pajak/delete`,
        (schema, { requestBody }) => {
            const { id } = JSON.parse(requestBody)
            schema.db.fakturPajaksData.remove({ id })
            return true
        }
    )

    server.get(`${apiPrefix}/faktur-pajak`, (schema, { queryParams }) => {
        const id = queryParams.id
        const berkas = schema.db.fakturPajaksData.find(id)
        return berkas
    })

    server.put(
        `${apiPrefix}/faktur-pajak/update`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            const { id } = data
            schema.db.fakturPajaksData.update({ id }, data)
            return true
        }
    )

    server.post(
        `${apiPrefix}/faktur-pajak/create`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            schema.db.fakturPajaksData.insert(data)
            return true
        }
    )
}
