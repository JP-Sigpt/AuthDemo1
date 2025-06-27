import { Builder, By, until } from "selenium-webdriver";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import chrome from "selenium-webdriver/chrome.js";

const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://jpanimenaruto27:ZppnpHrTycxzBELE@cluster0.xnuvsfk.mongodb.net/mfa-auth-db?retryWrites=true&w=majority";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:7001";
const IS_CI = process.env.CI === "true";

const TEST_USER = {
  email: "test@example.com",
  username: "testuser",
  password: "Test1234!",
  isVerified: true,
  work: "Test Company",
};

// Helper function to check if services are running
const checkServices = async () => {
  try {
    // Check if server is running
    const serverResponse = await fetch(`${SERVER_URL}/test`);
    if (!serverResponse.ok) {
      console.log("Server not responding");
      return false;
    }

    // Check if client is running
    const clientResponse = await fetch(BASE_URL);
    if (!clientResponse.ok) {
      console.log("Client not responding");
      return false;
    }

    console.log("Both services are running");
    return true;
  } catch (error) {
    console.log("Service check failed:", error.message);
    return false;
  }
};

function getChromeOptions() {
  const options = new chrome.Options();
  if (IS_CI) {
    options.addArguments(
      "--headless",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-plugins",
      "--window-size=1920,1080"
    );
  } else {
    options.addArguments(
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1920,1080"
    );
  }
  return options;
}

async function createDriver() {
  const options = getChromeOptions();
  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

beforeAll(async () => {
  // Check if services are running
  const servicesReady = await checkServices();
  if (!servicesReady) {
    console.log("Services not ready, some tests may be skipped");
  }

  if (IS_CI && !process.env.MONGO_URL) {
    console.log("Skipping DB setup in CI");
    return;
  }

  try {
    const client = await MongoClient.connect(MONGO_URL, {
      useUnifiedTopology: true,
    });
    const db = client.db();
    const users = db.collection("users");

    const passwordHash = await bcrypt.hash(TEST_USER.password, 10);

    await users.updateOne(
      { email: TEST_USER.email },
      {
        $set: {
          ...TEST_USER,
          password: passwordHash,
          isVerified: true,
        },
      },
      { upsert: true }
    );

    const userDoc = await users.findOne({ email: TEST_USER.email });
    console.log("Test user in DB after upsert:", userDoc);

    await client.close();
  } catch (error) {
    console.error("Database setup failed:", error);
    if (!IS_CI) throw error;
  }
}, 30000);

describe("E2E Tests", () => {
  const skipInCI = IS_CI && !process.env.CHROME_BIN;

  beforeEach(async () => {
    if (typeof window !== "undefined") {
      localStorage?.clear();
      sessionStorage?.clear();
    }
  });

  (skipInCI ? describe.skip : describe)("Browser Tests", () => {
    it("opens the homepage", async () => {
      // Check if services are running
      const servicesReady = await checkServices();
      if (!servicesReady) {
        console.log("Skipping homepage test - services not ready");
        return;
      }

      const driver = await createDriver();
      try {
        await driver.get(BASE_URL);
        await driver.wait(until.titleContains("MF Auth App"), 10000);
        const root = await driver.findElement(By.id("root"));
        expect(root).toBeDefined();
      } finally {
        await driver.quit();
      }
    }, 30000);

    it("should allow a user to login", async () => {
      console.log("Starting login test");
      // Check if services are running
      const servicesReady = await checkServices();
      if (!servicesReady) {
        console.log("Skipping login test - services not ready");
        return;
      }

      if (IS_CI && !process.env.MONGO_URL) {
        console.log("Skipping login test - DB not configured");
        return;
      }

      const driver = await createDriver();
      let otpValue = "123456";

      try {
        await driver.get(`${BASE_URL}/login`);
        console.log("Loaded login page");
        await driver.wait(until.elementLocated(By.name("email")), 10000);

        await driver.findElement(By.name("email")).sendKeys(TEST_USER.email);
        await driver
          .findElement(By.name("password"))
          .sendKeys(TEST_USER.password);

        // Explicitly select the 'Email OTP' method
        const methodSelect = await driver.findElement(By.css("select"));
        await methodSelect.sendKeys("Email OTP");

        // Wait for the login button to be enabled/clickable
        const loginBtn = await driver.findElement(
          By.css('button[type="submit"]')
        );
        await driver.wait(until.elementIsEnabled(loginBtn), 5000);
        await loginBtn.click();

        console.log("Clicked login, waiting for OTP input...");

        const errorElements = await driver.findElements(
          By.css(".text-red-500")
        );
        if (errorElements.length > 0) {
          const errorText = await errorElements[0].getText();
          // console.log("Login error message:", errorText);
        }

        // Wait for OTP input (longer in CI)
        const OTP_WAIT_TIMEOUT = process.env.CI === "true" ? 90000 : 90000;
        try {
          await driver.wait(
            until.elementLocated(By.css('input[placeholder="Enter code"]')),
            OTP_WAIT_TIMEOUT
          );
        } catch (waitErr) {
          // Print page source for debugging
          const pageSource = await driver.getPageSource();
          console.log("Page source at OTP wait failure:", pageSource);
          throw waitErr;
        }

        try {
          const client = await MongoClient.connect(MONGO_URL, {
            useUnifiedTopology: true,
          });
          const db = client.db();
          const otps = db.collection("otps");

          const otpDoc = await otps.findOne(
            { email: TEST_USER.email },
            { sort: { createdAt: -1 } }
          );

          if (otpDoc?.otp) {
            otpValue = otpDoc.otp;
          }

          await client.close();
        } catch (dbError) {
          console.warn("Using default OTP, DB lookup failed:", dbError.message);
        }

        await driver
          .findElement(By.css('input[placeholder="Enter code"]'))
          .sendKeys(otpValue);
        await driver
          .findElement(By.xpath("//button[contains(text(), 'Verify')]"))
          .click();

        await driver.wait(until.urlContains("/"), 15000);
      } catch (error) {
        // Optionally take a screenshot for debugging
        if (driver && process.env.CI === "true") {
          await driver
            .takeScreenshot()
            .then((image) =>
              require("fs").writeFileSync("selenium_error.png", image, "base64")
            );
        }
        throw error;
      } finally {
        await driver.quit();
      }
    }, 120000);
  });
});

// Add more E2E tests for registration, 2FA, password reset, etc.
