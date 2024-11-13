import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface StoreState {
  model: string,
  company: string
}

const initialState: StoreState = {
  model: localStorage.getItem('model') || 'chatgpt',
  company: localStorage.getItem('company') || 'caready'
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    
    setModel(state, action: PayloadAction<string>) { 
      state.model = action.payload;  
      localStorage.setItem('model', action.payload);
    },

    setCompany(state, action: PayloadAction<string>) { 
      state.company = action.payload;  
      localStorage.setItem('company', action.payload);
    },
    
  },
});

export const { setModel,setCompany } = storeSlice.actions;

export default storeSlice.reducer;
