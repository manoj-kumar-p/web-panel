import { FETCH_PINCODES } from '../types'

const initialState = {
    data: []
}

export const pincodesReducer = ( state = initialState, action ) => {
    switch (action.type) {
        case FETCH_PINCODES:
            return {
                data: action.payload
            }
        default:
            return state
    }
}



