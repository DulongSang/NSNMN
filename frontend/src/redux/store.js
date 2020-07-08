import { createStore } from "redux";

/*
store: {
    token: string,
    user: {
        username: string
        name: string
        avatar: string
    }
}
*/


function reducer(state, action) {
    switch(action.type) {
        case "UPDATE":
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

const initialState = {
    token: localStorage.getItem("token"),
    user: {
        username: null,
        name: null,
        avatar: null
    }
}

const store = createStore(reducer, initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;