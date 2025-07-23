import { RequestCookiesAdapter } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export const cookies = async () =>
  RequestCookiesAdapter.seal(new RequestCookies(new Headers()));

export default {
  cookies,
};
