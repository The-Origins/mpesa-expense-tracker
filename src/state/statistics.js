import { createSlice } from "@reduxjs/toolkit";
const statisticsSlice = createSlice({
  name: "statistics",
  initialState: { total: 0, entries: 0, expenses: {} },
  reducers: {
    setStatistics: (state, action) => {
      return action.payload;
    },
  },
});

export const { setStatistics } = statisticsSlice.actions;
export default statisticsSlice.reducer;
