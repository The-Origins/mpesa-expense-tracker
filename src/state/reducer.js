import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dictionaryReducer from "./dictionary";

const dictionaryPersistConfig = {
  key: "dictionary", // key for localStorage
  storage,
};

const storeReducer = combineReducers({
  dictionary: persistReducer(dictionaryPersistConfig, dictionaryReducer),
});

export default storeReducer;
