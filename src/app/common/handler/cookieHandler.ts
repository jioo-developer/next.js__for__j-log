export default function cookieHandler(name: string, value: string) {
  const time = new Date();
  const result = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    23,
    59,
    59
  );
  result.setMilliseconds(999);
  result.setHours(result.getHours() + 9);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${result.toUTCString()};`;
}
