import { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
}

export type TableLogQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
    idUser: string
}
export type TableProyekQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
    filterData?: {
        order?: string
        progress?: number
    }
}
