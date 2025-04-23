import type { Server } from 'miragejs'

export default function berkasProyekFakeApi(server: Server, apiPrefix: string) {
    // create
    server.post(
        `${apiPrefix}/berkasProyeks/create`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            schema.db.berkasProyeksData.insert(data)
            return true
        }
    )

    // get by id
    server.get(`${apiPrefix}/berkasProyek`, (schema, { queryParams }) => {
        const id = queryParams.id
        // Filter berdasarkan idProject, bukan mencari berdasarkan id
        const berkasProyek = schema.db.berkasProyeksData.where({
            idProject: id,
        })
        return berkasProyek
    })

    //update
    server.put(
        `${apiPrefix}/berkasProyeks/update`,
        (schema, { requestBody }) => {
            const data = JSON.parse(requestBody)
            const { id } = data
            schema.db.berkasProyeksData.update({ id }, data)
            return true
        }
    )

    // delete
    server.del(
        `${apiPrefix}/berkasProyeks/delete`,
        (schema, { requestBody }) => {
            const { id } = JSON.parse(requestBody)
            schema.db.berkasProyeksData.remove({ id })
            return true
        }
    )
}
