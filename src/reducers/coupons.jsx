import { FETCH_COUPONS } from '../types'

const initialState = {
    data: []
}

export const couponsReducer = ( state = initialState, action ) => {
    switch (action.type) {
        case FETCH_COUPONS:
            return {
                data: action.payload
            }
        default:
            return state
    }
}



