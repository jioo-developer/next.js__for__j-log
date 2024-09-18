import { usePathname, useRouter } from "next/navigation";

const time = new Date();
export const timeData = {
  year: time.getFullYear(),
  month: time.getMonth() + 1,
  day: time.getDate(),
};

export function cookieHandler(name: string) {
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
  document.cookie = `${name}-Cookie=${encodeURIComponent("done")}; expires=${result.toUTCString()};`;
}

export const useLocationrHandler = () => {
  return {
    pathname: usePathname(),
    handler: useRouter(),
  };
};
