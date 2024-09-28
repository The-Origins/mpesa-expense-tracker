import { createSlice } from "@reduxjs/toolkit";
const dictionarySlice = createSlice({
  name: "dictionary",
  initialState: {},
  reducers: {
    addToDictionary: (state, action) => {
      state[action.payload.key] = state[action.payload.key] || [];

      if (!state[action.payload.key].includes(action.payload.value)) {
        state[action.payload.key].unshift(action.payload.value);
      }
      console.log(state);
    },
    removeFromDictionary: (state, action) => {
      if (state[action.payload.key]) {
        state[action.payload.key] = state[action.payload.key].filter(
          (value) => value !== action.payload.value
        );
        if (!state[action.payload.key].length) {
          delete state[action.payload.key];
        }
      }
    },
    resetDictionary: (state) => {
      return {};
    },
  },
});

export const { addToDictionary, removeFromDictionary, resetDictionary } =
  dictionarySlice.actions;
export default dictionarySlice.reducer;
