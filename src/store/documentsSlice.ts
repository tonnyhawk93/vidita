import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { Document } from "../types";
import api from "../api";

export interface CounterState {
  documents: Document[];
}

const initialState: CounterState = {
  documents: [],
};

export const fetchDocuments = createAsyncThunk("/documents", async () => {
  const responses = await Promise.all([
    api.getDocuments1(),
    api.getDocuments2(),
  ]);

  return responses.flatMap(({ data }) => data);
});

export const fetchCancelOrder = createAsyncThunk(
  "/cancel",
  async (ids: string[]) => {
    await api.cancel(ids);

    return ids;
  }
);

export const documentsSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    deleteDocuments: (state) => {
      state.documents = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDocuments.fulfilled, (state, { payload }) => {
      state.documents = payload;
    });
    builder.addCase(fetchCancelOrder.fulfilled, (state, { payload: ids }) => {
      state.documents = state.documents.filter((doc) => !ids.includes(doc.id));
    });
  },
});

export default documentsSlice.reducer;
