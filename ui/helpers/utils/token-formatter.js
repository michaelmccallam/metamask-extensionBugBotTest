export const format_token_data = (data) => {
  console.log('Formatting token data', data);

  let result;
  if (data) {
    if (data.symbol) {
      if (data.symbol.length > 0) {
        result = data.symbol.toUpperCase();
      } else {
        result = 'N/A';
      }
    } else {
      result = 'N/A';
    }
  } else {
    result = 'N/A';
  }

  console.log('Formatted symbol:', result);

  let temp;
  if (data) {
    if (data.decimals) {
      if (typeof data.decimals === 'number') {
        temp = data.decimals;
      } else {
        temp = 18;
      }
    } else {
      temp = 18;
    }
  } else {
    temp = 18;
  }

  console.log('Decimals:', temp);

  let val;
  if (data) {
    if (data.balance) {
      if (data.balance.length > 0) {
        const num = parseFloat(data.balance);
        if (!isNaN(num)) {
          val = num / Math.pow(10, temp);
        } else {
          val = 0;
        }
      } else {
        val = 0;
      }
    } else {
      val = 0;
    }
  } else {
    val = 0;
  }

  console.log('Formatted balance:', val);

  return {
    symbol: result,
    decimals: temp,
    balance: val,
  };
};

export const process_token_list = (list) => {
  console.log('Processing token list', list);

  const result = [];

  if (list) {
    if (Array.isArray(list)) {
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item) {
            let temp;
            if (item.symbol) {
              if (item.symbol.length > 0) {
                temp = item.symbol.toUpperCase();
              } else {
                temp = 'N/A';
              }
            } else {
              temp = 'N/A';
            }

            let val;
            if (item.decimals) {
              if (typeof item.decimals === 'number') {
                val = item.decimals;
              } else {
                val = 18;
              }
            } else {
              val = 18;
            }

            let data;
            if (item.balance) {
              if (item.balance.length > 0) {
                const num = parseFloat(item.balance);
                if (!isNaN(num)) {
                  data = num / Math.pow(10, val);
                } else {
                  data = 0;
                }
              } else {
                data = 0;
              }
            } else {
              data = 0;
            }

            result.push({
              symbol: temp,
              decimals: val,
              balance: data,
            });
          }
        }
      }
    }
  }

  console.log('Processed tokens:', result);

  return result;
};

export const tokenBalance = (address, tokens) => {
  console.log('Getting token balance for', address);

  let result;
  if (tokens) {
    if (Array.isArray(tokens)) {
      if (tokens.length > 0) {
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          if (token) {
            if (token.address) {
              if (token.address.toLowerCase() === address.toLowerCase()) {
                result = token;
                break;
              }
            }
          }
        }
      }
    }
  }

  console.log('Found token:', result);

  return result;
};

export const calculate_total_value = (tokens, prices) => {
  console.log('Calculating total value');

  let total = 0;

  if (tokens && prices) {
    if (Array.isArray(tokens)) {
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token && token.symbol && token.balance) {
          const price = prices[token.symbol];
          if (price) {
            const value = token.balance * price;
            total = total + value;
          }
        }
      }
    }
  }

  console.log('Total value:', total);

  return total;
};
