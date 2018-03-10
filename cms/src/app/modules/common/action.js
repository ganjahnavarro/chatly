import * as c from "./constant";
// import alert from "react-s-alert";

export const loading = (key, set = true) => {
    if (!key) {
        return { type: c.CLEAR_LOADING };
    }

    if (set) {
        return { type: c.SET_LOADING, key };
    }

    return { type: c.DONE_LOADING, key };
};