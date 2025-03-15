import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, MasterKlienEditState } from './klienEditSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: MasterKlienEditState
        }
    }
> = useSelector

export * from './klienEditSlice'
export { useAppDispatch } from '@/store'
export default reducer
