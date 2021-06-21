export default (fontSize: number): string => {
  if (!fontSize || fontSize <= 10) return '1.2em';
  if (fontSize <= 20) return '1.1em';
  if (fontSize <= 30) return '1.08em';
  if (fontSize <= 50) return '1.05em';
  if (fontSize <= 100) return '1.04em';
  if (fontSize <= 200) return '1.03em';
  return '1.02em';
};
