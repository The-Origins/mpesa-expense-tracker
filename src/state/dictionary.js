import { createSlice } from "@reduxjs/toolkit";
const dictionarySlice = createSlice({
  name: "dictionary",
  initialState: {
    expenses: {
      shell: ["fuel"],
      total: ["fuel"],
      mart: ["groceries"],
    },
    keywords: ["shell", "total", "mart"],
  },
  reducers: {
    addToDictionary: (state, action) => {
      state.expenses[action.payload.key] = action.payload.value;
    },
    removeFromDictionary: (state, action) => {
      delete state.expenses[action.payload.key];
    },
    resetDictionary: (state) => {
      return {
        expenses: {
          shell: ["fuel"],
          total: ["fuel"],
          mart: ["groceries"],
        },
        keywords: ["shell", "total", "mart"],
      };
    },
    setDictionary: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  addToDictionary,
  removeFromDictionary,
  resetDictionary,
  setDictionary,
} = dictionarySlice.actions;
export default dictionarySlice.reducer;
