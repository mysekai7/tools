import clsx, { ClassValue } from 'clsx';

// Utility to merge Tailwind classes in a type-safe way
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
