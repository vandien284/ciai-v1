import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface StoreState {
  model: string,
  company: string
}

const initialState: StoreState = {
  model: 'chatgpt',
  company:  'caready'
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    
    setModel(state, action: PayloadAction<string>) { 
      state.model = action.payload;  
    },

    setCompany(state, action: PayloadAction<string>) { 
      state.company = action.payload;  
    },
    
  },
});

export const { setModel,setCompany } = storeSlice.actions;

export default storeSlice.reducer;
