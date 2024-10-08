import { createSlice } from "@reduxjs/toolkit";
const failedSlice = createSlice({
  name: "failed",
  initialState: [],
  reducers: {
    setFailed: (state, action) => {
      return action.payload;
    },
  },
});

export const { setFailed } = failedSlice.actions;
export default failedSlice.reducer;
