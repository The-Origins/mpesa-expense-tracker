import { createSlice } from "@reduxjs/toolkit";
const statisticsSlice = createSlice({
  name: "statistics",
  initialState: {all: { total: 0, entries: 0 }},
  reducers: {
    setStatistics: (state, action) => {
      return action.payload;
    },
  },
});

export const { setStatistics } = statisticsSlice.actions;
export default statisticsSlice.reducer;
