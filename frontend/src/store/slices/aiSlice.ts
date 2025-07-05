import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface AIInsight {
  type: string;
  title: string;
  message: string;
  details?: string;
}

interface AIPrediction {
  next_month: number;
  daily_average: number;
  confidence: string;
}

interface AIState {
  insights: AIInsight[];
  prediction: AIPrediction | null;
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  insights: [],
  prediction: null,
  loading: false,
  error: null,
};

export const fetchAIInsights = createAsyncThunk(
  'ai/fetchInsights',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as any;
      
      // Check if user exists and has ID
      if (!auth?.user?.id) {
        console.error('No user ID found in auth state:', auth);
        return rejectWithValue('User not authenticated or user ID missing');
      }
      
      const userId = auth.user.id;
      console.log('Fetching AI insights for user:', userId);
      
      const response = await fetch(`http://localhost:8000/api/ai/insights/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('AI insights response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI insights error:', errorText);
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('AI insights data:', data);
      
      return data;
    } catch (error: any) {
      console.error('AI insights fetch error:', error);
      return rejectWithValue(error.message || 'Failed to fetch insights');
    }
  }
);

export const fetchAIPrediction = createAsyncThunk(
  'ai/fetchPrediction',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as any;
      
      // Check if user exists and has ID
      if (!auth?.user?.id) {
        console.error('No user ID found in auth state:', auth);
        return rejectWithValue('User not authenticated or user ID missing');
      }
      
      const userId = auth.user.id;
      console.log('Fetching AI prediction for user:', userId);
      
      const response = await fetch(`http://localhost:8000/api/ai/prediction/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('AI prediction response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI prediction error:', errorText);
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('AI prediction data:', data);
      
      return data.prediction || data;
    } catch (error: any) {
      console.error('AI prediction fetch error:', error);
      return rejectWithValue(error.message || 'Failed to fetch prediction');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch insights
      .addCase(fetchAIInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload.insights || [];
        console.log('Insights loaded:', state.insights);
      })
      .addCase(fetchAIInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Insights loading failed:', action.payload);
      })
      // Fetch prediction
      .addCase(fetchAIPrediction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAIPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.prediction = action.payload;
        console.log('Prediction loaded:', state.prediction);
      })
      .addCase(fetchAIPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Prediction loading failed:', action.payload);
      });
  },
});

export const { clearError } = aiSlice.actions;
export default aiSlice.reducer;