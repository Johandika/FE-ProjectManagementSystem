import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import type { Server } from 'miragejs'

export default function subkontraktorFakeApi(
    server: Server,
    apiPrefix: string
) {
    server.post(
        `${apiPrefix}/master/subkontraktors`,
        (schema, { requestBody }) => {
            const body = JSON.parse(requestBody)
            const { pageIndex, pageSize, sort, query } = body
            const { order, key } = sort
            const subkontraktors = schema.db.subkontraktorsData
            const sanitizeSubkontraktors = subkontraktors.filter(
                (elm) => typeof elm !== 'function'
            )
            let data = sanitizeSubkontraktors
            let total = subkontraktors.length

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
        }
    )

    // New endpoint to get all subkontraktors without pagination
    server.get(`${apiPrefix}/subkontraktors`, (schema) => {
        const subkontraktors = schema.db.subkontraktorsData
        const sanitizeSubkontraktors = subkontraktors.filter(
            (elm) => typeof elm !== 'function'
        )

        // Sort by nama for convenience
        sanitizeSubkontraktors.sort((a, b) => a.nama.localeCompare(b.nama))

        const responseData = {
            data: sanitizeSubkontraktors,
            total: sanitizeSubkontraktors.length,
        }
        return responseData
    })

    server.del(
        `${apiPrefix}/master/subkontraktors/delete`,
        (schema, { requestBody }) => {
            const { id } = JSON.parse(requestBody)
            schema.db.subkontraktorsData.remove({ id })
            return true
        }
    )

    server.get(
        `${apiPrefix}/master/subkontraktor`,
        (schema, { queryParams }) => {
            const id = queryParams.id
            const subkontraktor = schema.db.subkontraktorsData.find(id)
            return subkontraktor
        }
    )

    server.put(
        `${apiPrefix}/master/subkontraktors/update`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            const { id } = data
            schema.db.subkontraktorsData.update({ id }, data)
            return true
        }
    )

    server.post(
        `${apiPrefix}/master/subkontraktors/create`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            schema.db.subkontraktorsData.insert(data)
            return true
        }
    )
}
