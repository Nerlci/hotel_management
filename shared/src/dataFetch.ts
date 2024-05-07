import {
  ACUpdateRequestBody,
  DateRange,
  LoginForm,
  RegisterForm,
  acDetailResponse,
  receptionAvailableResponse,
  responseBase,
  userAvailablityResponse,
  userRoomOrderResponse,
} from "./schema";

export const BASE_URL = "http://localhost:8080";

export async function getRoomAvailable(body: DateRange) {
  const response = await fetch(
    `${BASE_URL}/api/room/available?startDate=${body.startDate}&endDate=${body.endDate}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const responseJson = await response.json();
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  const parsed = receptionAvailableResponse.parse(responseJson);
  return parsed;
}

export async function getRoomAvailability(body: DateRange) {
  const response = await fetch(
    `${BASE_URL}/api/room/availability?startDate=${body.startDate}&endDate=${body.endDate}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const parsed = userAvailablityResponse.parse(await response.json());
  if (parsed.code !== "200") {
    throw new Error(parsed.error.msg);
  }
  return parsed.payload.unavailableDates.map((d) => new Date(d));
}

export async function postRoomBooking(body: DateRange) {
  const response = await fetch(`${BASE_URL}/api/room/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const parsed = responseBase.parse(await response.json());
  if (parsed.code !== "200") {
    throw new Error(parsed.error.msg);
  }
}

export async function getUserRoomOrder() {
  const response = await fetch(`${BASE_URL}/api/room/order`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const json = userRoomOrderResponse.parse(await response.json());
  if (json.code !== "200") {
    throw new Error(json.error.msg);
  }
  return json;
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

export async function getUserRoomNumber() {
  // TODO: call api
  return new Promise<string>((resolve) => {
    resolve("8103");
  });
}

export function generateGetUserAirconDetail(roomId: string) {
  return async () => {
    const response = await fetch(`${BASE_URL}/api/ac/detail?roomId=${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Request failed");
    }
    // TODO: parse the response
    const json = acDetailResponse.parse(await response.json());
    if (json.code !== "200") {
      throw new Error(json.error.msg);
    }
    return json;
  };
}
