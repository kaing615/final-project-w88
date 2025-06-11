import { configureStore } from "@reduxjs/toolkit"; 
import { userSlice } from "./features/userSlice.js";
import { themeModeSlice } from "./features/themeModeSlice.js";
import { authModalSlice } from "./features/authModalSlice.js";
import { appStateSlice } from "./features/appStateSlice.js";
import { globalLoadingSlice } from "./features/globalLoadingSlice.js";

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        themeMode: themeModeSlice.reducer,
        authModal: authModalSlice.reducer,
        appState: appStateSlice.reducer,
        globalLoading: globalLoadingSlice.reducer,
    },
});

export default store;