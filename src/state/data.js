import { createSlice } from "@reduxjs/toolkit";
const dataSlice = createSlice({
  name: "data",
  initialState: {
    isFetching: false,
    expenses: [],
    statistics: {},
    failed: [],
  },
  reducers: {
    setData: (state, action) => {
      return action.payload;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setStatistics: (state, action) => {
      state.statistics = action.payload;
    },
    setFailed: (state, action) => {
      state.failed = action.payload;
    },
  },
});

export const { setData, setExpenses, setStatistics, setFailed } =
  dataSlice.actions;
export default dataSlice.reducer;
