import { DEMO_LOGIN_EMAIL, DEMO_LOGIN_PASSWORD } from "./accountData";

export function validateDemoCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === DEMO_LOGIN_EMAIL && password === DEMO_LOGIN_PASSWORD;
}
