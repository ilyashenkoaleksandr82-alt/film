// Формат чисел по-русски: десятичная запятая, неразрывные пробелы в тысячах.
export const fmt = (n: number, decimals = 0, sep = false): string => {
  const [i, f] = n.toFixed(decimals).split('.');
  const ii = sep ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') : i;
  return f ? `${ii},${f}` : ii;
};
