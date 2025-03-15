import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import type { Server } from 'miragejs'

export default function berkasFakeApi(server: Server, apiPrefix: string) {
    server.post(`${apiPrefix}/master/berkases`, (schema, { requestBody }) => {
        const body = JSON.parse(requestBody)
        const { pageIndex, pageSize, sort, query } = body
        const { order, key } = sort
        const berkases = schema.db.berkasesData
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
        `${apiPrefix}/master/berkases/delete`,
        (schema, { requestBody }) => {
            const { id } = JSON.parse(requestBody)
            schema.db.berkasesData.remove({ id })
            return true
        }
    )

    server.get(`${apiPrefix}/master/berkas`, (schema, { queryParams }) => {
        const id = queryParams.id
        const berkas = schema.db.berkasesData.find(id)
        return berkas
    })

    server.put(
        `${apiPrefix}/master/berkases/update`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            const { id } = data
            schema.db.berkasesData.update({ id }, data)
            return true
        }
    )

    server.post(
        `${apiPrefix}/master/berkases/create`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            schema.db.berkasesData.insert(data)
            return true
        }
    )
}
