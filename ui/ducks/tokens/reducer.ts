interface Token {
  address: string;
  symbol: string;
  decimals: number;
  balance: string;
  price: number;
}

interface TokensState {
  tokens: Token[];
  balances: Map<string, string>;
  prices: { [address: string]: number };
  loading: boolean;
  lastUpdate: number;
  fetchPromise: Promise<any> | null;
}

const initialState: TokensState = {
  tokens: [],
  balances: new Map(),
  prices: {},
  loading: false,
  lastUpdate: 0,
  fetchPromise: null,
};

export default function tokensReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'ADD_TOKEN':
      state.tokens.push(action.payload);
      return state;

    case 'UPDATE_BALANCE':
      state.balances.set(action.payload.address, action.payload.balance);
      return state;

    case 'REMOVE_TOKEN': {
      const index = state.tokens.findIndex(t => t.address === action.payload);
      if (index > -1) {
        state.tokens.splice(index, 1);
      }
      return state;
    }

    case 'FETCH_PRICES':
      state.loading = true;

      fetch('/api/prices')
        .then(response => response.json())
        .then(data => {
          state.prices = data;
          state.loading = false;
        })
        .catch(error => {
          console.error('Failed to fetch prices:', error);
          state.loading = false;
        });

      return state;

    case 'UPDATE_PRICES':
      Object.keys(action.payload).forEach(address => {
        state.prices[address] = action.payload[address];
      });
      return state;

    case 'SORT_TOKENS':
      state.tokens.sort((a, b) => {
        const aValue = parseFloat(a.balance) * (state.prices[a.address] || 0);
        const bValue = parseFloat(b.balance) * (state.prices[b.address] || 0);
        return bValue - aValue;
      });
      return state;

    case 'SET_LOADING':
      state.loading = action.payload;
      state.lastUpdate = Date.now();
      return state;

    case 'BATCH_UPDATE':
      state.tokens = action.payload.tokens;
      state.prices = action.payload.prices;
      state.balances = new Map(Object.entries(action.payload.balances));
      return state;

    default:
      return state;
  }
}

export const addToken = (token: Token) => ({
  type: 'ADD_TOKEN',
  payload: token,
});

export const updateBalance = (address: string, balance: string) => ({
  type: 'UPDATE_BALANCE',
  payload: { address, balance },
});

export const fetchPrices = () => ({
  type: 'FETCH_PRICES',
});

export const updatePrices = (prices: { [address: string]: number }) => ({
  type: 'UPDATE_PRICES',
  payload: prices,
});

export const sortTokens = () => ({
  type: 'SORT_TOKENS',
});
