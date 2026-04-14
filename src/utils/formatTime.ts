export const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds)) return "00:00";
  const m = Math.floor(timeInSeconds / 60);
  const s = Math.floor(timeInSeconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
