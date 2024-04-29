import { LoginForm } from "@/routes/Login";
import { RegisterForm } from "@/routes/Register";
import { ACUpdateRequestBody, UserAvailablityResponse, responseBase } from "shared";

export const BASE_URL = import.meta.env.VITE_API_URL as string;

export async function getRoomAvailability() {
  const response = await fetch(`${BASE_URL}/api/room/availability`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const parsed = UserAvailablityResponse.parse(await response.json());
  return parsed.payload.unavailableDates.map((d) => new Date(d));
}

export async function postUserRegister(values: RegisterForm) {
  const response = await fetch(`${BASE_URL}/api/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const json = responseBase.parse(await response.json());
  if (json.code !== "200") {
    throw new Error(json.error.msg);
  }
  return json;
}

export async function postUserLogin(values: LoginForm) {
  const response = await fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const json = /* responseBase.parse */ await response.json();
  if (json.code !== "200") {
    throw new Error(json.error.msg);
  }
  return json;
}

export async function getUserLogout() {
  const response = await fetch(`${BASE_URL}/api/user/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const json = responseBase.parse(await response.json());
  if (json.code !== "200") {
    throw new Error(json.error.msg);
  }
  return json;
}

export async function postUserAirconUpdate(value: ACUpdateRequestBody) {
  const response = await fetch(`${BASE_URL}/api/ac/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const json = responseBase.parse(await response.json());
  if (json.code !== "200") {
    throw new Error(json.error.msg);
  }
  return json;
}
