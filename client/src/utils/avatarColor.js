export function stringToGradient(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color1 = `hsl(${hash % 360}, 70%, 50%)`;
  const color2 = `hsl(${(hash + 60) % 360}, 70%, 50%)`;
  return `linear-gradient(135deg, ${color1}, ${color2})`;
}
