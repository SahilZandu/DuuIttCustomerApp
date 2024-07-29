export function currencyFormat(value, isCurrenyInput) {
    const currency = '₹';
    const v = Number(value);
  
    let t = String(value);
    let res = t.includes('.');
  
    let decimal = res ? 2 : 0;
  
    if (res && isCurrenyInput) {
      let s = t.split('.');
      if (s[1].length == 1) {
        decimal;
      }
      decimal = s[1].length;
    }
  
    if (value == 0) {
      return currency + v.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    } else {
      let vv = v.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  
      return currency + String(vv);
    }
  }
  