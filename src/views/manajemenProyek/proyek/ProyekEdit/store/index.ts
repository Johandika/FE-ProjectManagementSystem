import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, MasterProyekEditState } from './proyekEditSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: MasterProyekEditState
        }
    }
> = useSelector

export * from './proyekEditSlice'
export { useAppDispatch } from '@/store'
export default reducer
