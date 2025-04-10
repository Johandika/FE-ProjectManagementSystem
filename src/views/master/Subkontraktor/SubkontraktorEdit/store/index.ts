import { combineReducers } from '@reduxjs/toolkit'
import reducers, {
    SLICE_NAME,
    MasterSubkontraktorEditState,
} from './subkontraktorEditSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: MasterSubkontraktorEditState
        }
    }
> = useSelector

export * from './subkontraktorEditSlice'
export { useAppDispatch } from '@/store'
export default reducer
