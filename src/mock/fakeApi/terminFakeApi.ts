import type { Server } from 'miragejs'

export default function terminFakeApi(server: Server, apiPrefix: string) {
    // get by id
    server.get(`${apiPrefix}/termin`, (schema, { queryParams }) => {
        const id = queryParams.id
        // Filter berdasarkan idProject, bukan mencari berdasarkan id
        const termin = schema.db.terminsData.where({
            idProject: id,
        })
        return termin
    })

    // server.post(`${apiPrefix}/master/kliens`, (schema, { requestBody }) => {
    //     const body = JSON.parse(requestBody)
    //     const { pageIndex, pageSize, sort, query } = body
    //     const { order, key } = sort
    //     const products = schema.db.kliensData
    //     const sanitizeProducts = products.filter(
    //         (elm) => typeof elm !== 'function'
    //     )
    //     let data = sanitizeProducts
    //     let total = products.length

    //     if ((key === 'category' || key === 'name') && order) {
    //         data.sort(
    //             sortBy(key, order === 'desc', (a) =>
    //                 (a as string).toUpperCase()
    //             )
    //         )
    //     } else {
    //         data.sort(sortBy(key, order === 'desc', parseInt as Primer))
    //     }

    //     if (query) {
    //         data = wildCardSearch(data, query)
    //         total = data.length
    //     }

    //     data = paginate(data, pageSize, pageIndex)

    //     const responseData = {
    //         data: data,
    //         total: total,
    //     }
    //     return responseData
    // })

    // // New endpoint to get all kliens without pagination
    // server.get(`${apiPrefix}/termins`, (schema) => {
    //     const kliens = schema.db.kliensData
    //     const sanitizeKliens = kliens.filter((elm) => typeof elm !== 'function')

    //     // Sort by nama for convenience
    //     sanitizeKliens.sort((a, b) => a.nama.localeCompare(b.nama))

    //     const responseData = {
    //         data: sanitizeKliens,
    //         total: sanitizeKliens.length,
    //     }
    //     return responseData
    // })

    // server.del(
    //     `${apiPrefix}/master/kliens/delete`,
    //     (schema, { requestBody }) => {
    //         const { id } = JSON.parse(requestBody)
    //         schema.db.kliensData.remove({ id })
    //         return true
    //     }
    // )

    // server.get(`${apiPrefix}/master/klien`, (schema, { queryParams }) => {
    //     const id = queryParams.id
    //     const product = schema.db.kliensData.find(id)
    //     return product
    // })

    server.put(`${apiPrefix}/termin/update`, (schema, { requestBody }) => {
        const data = JSON.parse(requestBody)
        const { id } = data
        schema.db.kliensData.update({ id }, data)
        return true
    })

    // server.post(
    //     `${apiPrefix}/master/kliens/create`,
    //     (schema, { requestBody }) => {
    //         const data = JSON.parse(requestBody)
    //         schema.db.kliensData.insert(data)
    //         return true
    //     }
    // )
}
