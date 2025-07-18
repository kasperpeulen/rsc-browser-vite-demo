import { setupWorker } from "msw/browser";

export const msw = setupWorker();

export const api = (url: string) =>
  `https://jsonplaceholder.typicode.com${url}`;
