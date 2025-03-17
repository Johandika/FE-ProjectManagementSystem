import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import type { Server } from 'miragejs'

export default function proyekFakeApi(server: Server, apiPrefix: string) {
    server.post(`${apiPrefix}/manajemen-proyek`, (schema, { requestBody }) => {
        const body = JSON.parse(requestBody)
        const { pageIndex, pageSize, sort, query } = body
        const { order, key } = sort
        const proyeks = schema.db.proyeksData
        const sanitizeProyeks = proyeks.filter(
            (elm) => typeof elm !== 'function'
        )
        let data = sanitizeProyeks
        let total = proyeks.length

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
        `${apiPrefix}/manajemen-proyek/delete`,
        (schema, { requestBody }) => {
            const { id } = JSON.parse(requestBody)
            schema.db.proyeksData.remove({ id })
            return true
        }
    )

    server.get(`${apiPrefix}/manajemen-proyek`, (schema, { queryParams }) => {
        const id = queryParams.id
        const proyek = schema.db.proyeksData.find(id)
        return proyek
    })

    server.put(
        `${apiPrefix}/manajemen-proyek/update`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            const { id } = data
            schema.db.proyeksData.update({ id }, data)
            return true
        }
    )

    server.post(
        `${apiPrefix}/manajemen-proyek/create`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            schema.db.proyeksData.insert(data)
            return true
        }
    )
}
