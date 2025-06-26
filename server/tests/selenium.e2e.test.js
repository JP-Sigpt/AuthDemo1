import { Builder } from "selenium-webdriver";

describe("Server E2E", () => {
  it("should open the API root", async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    try {
      await driver.get("http://localhost:7001");
      // You can add more checks here
    } finally {
      await driver.quit();
    }
  }, 20000);
});
