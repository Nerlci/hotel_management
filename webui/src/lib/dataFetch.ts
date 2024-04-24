import { LoginForm } from "@/routes/Login";
import { RegisterForm } from "@/routes/Register";
import { UserAvailablityResponse, responseBase } from "shared";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export async function getRoomAvailability() {
  // validate using UserAvailablityResponse
  const response = await fetch(`${BASE_URL}/api/room/availability`);
  const parsed = UserAvailablityResponse.parse(await response.json());
  return parsed.payload.unavailableDates.map((d) => new Date(d));
}

export async function PostUserRegister(values: RegisterForm) {
  const response = await fetch(`${BASE_URL}/api/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
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

export async function PostUserLogin(values: LoginForm) {
  const response = await fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
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
