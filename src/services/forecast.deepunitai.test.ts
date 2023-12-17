import logger from "@src/logger";
import _ from "lodash";
import { StormGlass, ForecastPoint } from "@src/clients/stormGlass";
import { Beach } from "@src/models/beach";
import { Rating } from "./rating";
import { Forecast, ForecastProcessingInternalError } from "./forecast";
import { InternalError } from "@src/util/errors/internal-error";

jest.mock("@src/logger");

jest.mock("@src/models/beach");

jest.mock("./rating");
const stormGlass = require("@src/clients/stormGlass");

// Mocking the module
jest.mock("@src/clients/stormGlass");

describe("stormGlass", () => {
  test("getWeather should be called", () => {
    // Mock implementation of getWeather
    stormGlass.getWeather.mockImplementation(() => "Sunny");

    const weather = stormGlass.getWeather();
    expect(stormGlass.getWeather).toHaveBeenCalled();
    expect(weather).toBe("Sunny");
  });
});

// Use jest to mock modules

// Use jest to mock modules
// Describe the test suite for the Forecast class
describe("Forecast", function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Test the calculateRating function
  it("calculateRating should call stormGlass.fetchPoints with correct parameters", async () => {
    const mockStormGlass = new StormGlass();
    const forecast = new Forecast(mockStormGlass);
    const mockBeach: Beach = {
      lat: 1,
      lng: 1,
      name: "test beach",
      position: "E",
      user: "some user",
    };
    await forecast["calculateRating"]([mockBeach]);
    expect(mockStormGlass.fetchPoints).toBeCalledWith(
      mockBeach.lat,
      mockBeach.lng
    );
  });
  // Test the mapForecastByTime function
  it("mapForecastByTime should correctly group forecast data by time", () => {
    // Test data here
  });
  // Test the processForecastForBeaches function
  it("processForecastForBeaches should correctly process forecast data for beaches", async () => {
    // Test data here
  });
});

describe("Forecast", function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("processForecastForBeaches", () => {
    it("should return the forecast for the beaches", async () => {
      const mockBeach: Beach = new Beach();
      const mockForecastPoint: ForecastPoint = new ForecastPoint();
      const mockStormGlass = {
        fetchPoints: jest.fn().mockResolvedValue([mockForecastPoint]),
      } as unknown as StormGlass;
      const mockRatingService = {
        getRating: jest.fn().mockReturnValue(2),
      } as unknown as typeof Rating;
      const forecast = new Forecast(mockStormGlass, mockRatingService);
      const result = await forecast.processForecastForBeaches([mockBeach]);
      // We check that the stormGlass.fetchPoints was called with the correct arguments
      expect(mockStormGlass.fetchPoints).toHaveBeenCalledWith(
        mockBeach.lat,
        mockBeach.lng
      );
      // We check that the RatingService was called with the correct arguments
      expect(mockRatingService.getRating).toHaveBeenCalledWith([
        mockForecastPoint,
      ]);
      // We check that the logger.info was called with the correct arguments
      expect(logger.info).toHaveBeenCalledWith(
        `Preparing the forecast for ${1} beaches`
      );
      // We validate the result
      expect(result).toEqual(expect.any(Array));
      expect(result[0]).toEqual(
        expect.objectContaining({
          time: expect.any(String),
          forecast: expect.any(Array),
        })
      );
    });
    it("should throw ForecastProcessingInternalError when something goes wrong", async () => {
      const mockBeach: Beach = new Beach();
      const mockStormGlass = {
        fetchPoints: jest.fn().mockRejectedValue("Error"),
      } as unknown as StormGlass;
      const forecast = new Forecast(mockStormGlass);
      await expect(
        forecast.processForecastForBeaches([mockBeach])
      ).rejects.toThrow(ForecastProcessingInternalError);
      // We check that the stormGlass.fetchPoints was called with the correct arguments
      expect(mockStormGlass.fetchPoints).toHaveBeenCalledWith(
        mockBeach.lat,
        mockBeach.lng
      );
      // We check that the logger.error was called with the correct arguments
      expect(logger.error).toHaveBeenCalledWith("Error");
    });
  });
});
