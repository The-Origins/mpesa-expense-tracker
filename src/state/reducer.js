import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user";
import dictionaryReducer from "./dictionary";
import expensesReducer from "./expenses";
import statisticsReducer from "./statistics";
import failedReducer from "./failed";

const dictionaryPersistConfig = {
  key: "dictionary", // key for localStorage
  storage,
};

const storeReducer = combineReducers({
  dictionary: persistReducer(dictionaryPersistConfig, dictionaryReducer),
  user: userReducer,
  expenses: expensesReducer,
  statistics: statisticsReducer,
  failed: failedReducer,
});

export default storeReducer;
