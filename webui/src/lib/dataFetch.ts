import { UserAvailablityResponse } from "shared";

const BASE_URL = "http://localhost:8080";

export async function getRoomAvailability() {
  // validate using UserAvailablityResponse
  const response = await fetch(`${BASE_URL}/api/room/availability`)
  const parsed = UserAvailablityResponse.parse(await response.json());
  return parsed.payload.unavailableDates.map((d) => new Date(d));
}
