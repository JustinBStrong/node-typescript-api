import _ from "lodash";
import logger from "@src/logger";
import { Forecast } from "./forecast";
import { StormGlass, ForecastPoint } from "@src/clients/stormGlass";
import { Beach } from "@src/models/beach";
import { BeachForecast, TimeForecast } from "@src/services/forecast";
import { InternalError } from "@src/util/errors/internal-error";
import { Rating } from "./rating";

// Mock the logger
jest.mock("@src/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Mock the StormGlass
jest.mock("@src/clients/stormGlass");

// Mock the logger

// Mock the StormGlass
// Mock the logger
// Mock the StormGlass
describe("Forecast Service", function () {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it("should return the forecast for a list of beaches ordered by rating", async () => {
    // Prepare data for the test
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
        user: "fake-id",
      },
    ];
    // Mock the stormGlass.fetchPoints method
    StormGlass.prototype.fetchPoints = jest.fn().mockResolvedValueOnce([]);
    // Create an instance of the forecast service
    const forecast = new Forecast();
    // Execute the method to test
    const result = await forecast.processForecastForBeaches(
      beaches,
      "asc",
      "rating"
    );
    // Check if the result is an instance of TimeForecast
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty("time");
    expect(result[0]).toHaveProperty("forecast");
    // Check if the forecast is ordered by rating
    const ratings = result[0].forecast.map(
      (forecast: BeachForecast) => forecast.rating
    );
    const isOrdered = ratings
      .slice(1)
      .every((rating, i) => rating >= ratings[i]);
    expect(isOrdered).toBe(true);
  });
});
