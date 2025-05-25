import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    email?: string
    authorization?: string
    role?: string
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
            state.email = action.payload?.email
            state.username = action.payload?.username
            state.role = action.payload?.role
            state.authorization = action.payload?.authorization
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
