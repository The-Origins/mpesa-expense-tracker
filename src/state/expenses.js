import { createSlice } from "@reduxjs/toolkit";
const expensesSlice = createSlice({
  name: "expenses",
  initialState: [],
  reducers: {
    setExpenses: (state, action) => {
      return action.payload;
    },
  },
});

export const { setExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
