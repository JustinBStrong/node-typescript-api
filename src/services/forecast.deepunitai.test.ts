import logger from "@src/logger";
import _ from "lodash";
import { StormGlass, ForecastPoint } from "@src/clients/stormGlass";
import { Beach } from "@src/models/beach";
import { Forecast } from "./forecast";
import { InternalError } from "@src/util/errors/internal-error";
import { Rating } from "./rating";

// Mocking the logger module
jest.mock("@src/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Mocking the StormGlass module
jest.mock("@src/clients/stormGlass", () => ({
  StormGlass: jest.fn(() => ({
    fetchPoints: jest.fn(),
  })),
}));

// Mocking the logger module

// Mocking the StormGlass module
// Mocking the logger module
// Mocking the StormGlass module
describe("Forecast Service", function () {
  // Resetting all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restoring all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("should return the forecast for the beaches ordered by rating", async () => {
    // Mocking the return of fetchPoints
    (StormGlass.prototype.fetchPoints as jest.Mock).mockResolvedValue([]);
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
      },
    ];
    const expectedResponse = [
      {
        time: "2020-04-26T00:00:00+00:00",
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: "Manly",
            position: "E",
            rating: 1,
            time: "2020-04-26T00:00:00+00:00",
          },
        ],
      },
    ];
    const forecast = new Forecast();
    const beachesForecast = await forecast.processForecastForBeaches(
      beaches,
      "asc",
      "rating"
    );
    expect(beachesForecast).toEqual(expectedResponse);
  });
  it("should throw internal processing error when something goes wrong during the rating process", async () => {
    // Mocking the return of fetchPoints
    (StormGlass.prototype.fetchPoints as jest.Mock).mockRejectedValue(
      "Error fetching data"
    );
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
      },
    ];
    const forecast = new Forecast();
    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      new InternalError(
        `Unexpected error during the forecast processing: Error fetching data`
      )
    );
  });
});
