import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    id?: string
    email?: string
    authorization?: string
    authority?: string
    username?: string
}

const initialState: UserState = {
    email: '',
    authorization: '',
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            // Gabungkan state yang ada dengan payload baru
            // Field yang tidak ada di payload akan mempertahankan nilainya
            return {
                ...state,
                ...action.payload,
            }

            // state.id = action.payload?.id
            // state.email = action.payload?.email
            // state.username = action.payload?.username
            // state.authority = action.payload?.authority
            // state.authorization = action.payload?.authorization
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
