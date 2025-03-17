import { combineReducers } from '@reduxjs/toolkit'
import reducers, {
    SLICE_NAME,
    FakturPajakListSlice,
} from './fakturPajakListSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: FakturPajakListSlice
        }
    }
> = useSelector

export * from './fakturPajakListSlice'
export { useAppDispatch } from '@/store'
export default reducer
