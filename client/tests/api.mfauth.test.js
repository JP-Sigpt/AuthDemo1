import { setup2Fa, verify2Fa, reset2Fa } from "../src/services/api.mfauth.js";

describe("api.mfauth", () => {
  it("should export setup2Fa", () => {
    expect(setup2Fa).toBeDefined();
  });
  // Add more tests for each function, mock axios if needed
});
