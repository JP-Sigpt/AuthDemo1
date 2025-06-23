import { Builder, By, until } from "selenium-webdriver";

it("opens the homepage", async () => {
  const driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:3001");
    await driver.wait(until.titleContains("MF Auth App"), 5000);
    const root = await driver.findElement(By.id("root"));
    expect(root).toBeDefined();
  } finally {
    await driver.quit();
  }
}, 20000);

// E2E: User Authentication Flow
it("should allow a user to login", async () => {
  const driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:3001/login");
    await driver.findElement(By.name("email")).sendKeys("test@example.com");
    await driver.findElement(By.name("password")).sendKeys("Test1234!");
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains("/dashboard"), 10000);
    const url = await driver.getCurrentUrl();
    expect(url).toContain("/dashboard");
  } finally {
    await driver.quit();
  }
}, 20000);

// Add more E2E tests for registration, 2FA, password reset, etc.
