import {
  ACUpdateRequestBody,
  DateRange,
  LoginForm,
  ReceptionCheckinRequest,
  RegisterForm,
  UserRoomOrderResponse,
  acDetailResponse,
  getACDetailResponse,
  getRoomBillResponse,
  getTargetRangeResponse,
  receptionAllRooms,
  receptionAvailableResponse,
  receptionCheckinableResponse,
  responseBase,
  userAvailablityResponse,
  userLoginResponse,
  userRoomOrderResponse,
} from "./schema";

export const BASE_URL = process.env.VITE_API_URL || "http://localhost:8080";

export async function deleteUserBooking() {
  const response = await fetch(`${BASE_URL}/api/room/book`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
}

export async function getUserIdByEmail(email: string) {
  const response = await fetch(`${BASE_URL}/api/user/email?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  return responseJson.payload.userId as string;
}

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
  if (responseJson.code === "401") {
    throw new Error("401");
  }
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
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  const parsed = userAvailablityResponse.parse(responseJson);
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
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  const parsed = responseBase.parse(responseJson);
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
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  let json: UserRoomOrderResponse;
  try {
    json = userRoomOrderResponse.parse(responseJson);
  } catch (e) {
    throw e;
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
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  const json = responseBase.parse(responseJson);
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
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  const json = userLoginResponse.parse(responseJson);
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
  if (json.code === "401") {
    throw new Error("401");
  }
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
  if (json.code === "401") {
    throw new Error("401");
  }
  if (json.code !== "200") {
    throw new Error(json.error.msg);
  }
  return json;
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
    const json = acDetailResponse.parse(await response.json());
    if (json.code === "401") {
      throw new Error("401");
    }
    if (json.code !== "200") {
      throw new Error(json.error.msg);
    }
    return json;
  };
}

export async function postReceptionCheckin(body: ReceptionCheckinRequest) {
  const response = await fetch(
    `${BASE_URL}/api/room/checkin?roomId=${body.roomId}&userId=${body.userId}`,
    {
      method: "POST",
      mode: "cors",
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
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  const json = responseBase.parse(responseJson);
  if (json.code !== "200") {
    throw new Error(json.error.msg);
  }
  return json;
}

export async function getReceptionCheckinableRooms(userId: string) {
  const response = await fetch(`${BASE_URL}/api/room/room?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  const json = receptionCheckinableResponse.parse(responseJson);
  return json;
}

export async function getAirconTempRange() {
  const response = await fetch(`${BASE_URL}/api/ac/target-range`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  return responseJson.payload;
}

export async function getAirconPriceRate() {
  const response = await fetch(`${BASE_URL}/api/ac/price-rate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  return responseJson.payload;
}

export async function putAirconTempRange(minTarget: number, maxTarget: number) {
  const response = await fetch(`${BASE_URL}/api/ac/target-range`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ minTarget, maxTarget }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const json = responseBase.parse(await response.json());
  if (json.code === "401") {
    throw new Error("401");
  }
  if (json.code !== "200") {
    throw new Error(json.error.msg);
  }
  return json;
}

export async function putAirconPriceRate(priceRate: number) {
  const response = await fetch(`${BASE_URL}/api/ac/price-rate`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priceRate }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const json = responseBase.parse(await response.json());
  if (json.code === "401") {
    throw new Error("401");
  }
  if (json.code !== "200") {
    throw new Error(json.error.msg);
  }
  return json;
}

export async function getReceptionAllRooms() {
  const response = await fetch(`${BASE_URL}/api/room/rooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  const json = receptionAllRooms.parse(responseJson);
  return json;
}

export async function postReceptionCheckout(userId: string) {
  const response = await fetch(
    `${BASE_URL}/api/room/checkout?userId=${userId}`,
    {
      method: "POST",
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
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  const json = responseBase.parse(responseJson);
  return json;
}

export async function getBillDetail(roomId: string) {
  const response = await fetch(`${BASE_URL}/api/room/bill?roomId=${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  const json = getRoomBillResponse.parse(responseJson);
  return json.payload;
}

export async function getACDetail(roomId: string) {
  const response = await fetch(
    `${BASE_URL}/api/ac/statement?roomId=${roomId}`,
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
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  const json = getACDetailResponse.parse(responseJson);
  return json.payload;
}

export async function getACDetailFile(roomId: string) {
  const response = await fetch(
    `${BASE_URL}/api/ac/statement-file?roomId=${roomId}`,
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
  return response.blob();
}

export async function getBillDetailFile(roomId: string) {
  const response = await fetch(
    `${BASE_URL}/api/room/bill-file?roomId=${roomId}`,
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
  return response.blob();
}

export async function getACTargetRange() {
  const response = await fetch(`${BASE_URL}/api/ac/target-range`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const responseJson = await response.json();
  if (responseJson.code === "401") {
    throw new Error("401");
  }
  if (responseJson.code !== "200") {
    throw new Error(responseJson.error.msg);
  }
  const json = getTargetRangeResponse.parse(responseJson);
  return json.payload;
}
