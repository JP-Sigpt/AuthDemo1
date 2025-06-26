import { Builder, By, until } from "selenium-webdriver";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGO_URL =
  "mongodb+srv://jpanimenaruto27:ZppnpHrTycxzBELE@cluster0.xnuvsfk.mongodb.net/mfa-auth-db?retryWrites=true&w=majority";
const TEST_USER = {
  email: "test@example.com",
  username: "testuser",
  password: "Test1234!",
  isVerified: true,
  work: "Test Company",
};

beforeAll(async () => {
  const client = await MongoClient.connect(MONGO_URL, {
    useUnifiedTopology: true,
  });
  const db = client.db(); // use your db name if needed
  const users = db.collection("users");

  // Hash the password as your backend does
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

  await client.close();
}, 20000);

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
    await driver.wait(until.elementLocated(By.name("email")), 5000);
    await driver.findElement(By.name("email")).sendKeys("test@example.com");
    await driver.findElement(By.name("password")).sendKeys("Test1234!");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // wait for VerifyModal to appear
    await driver.wait(
      until.elementLocated(By.css('input[placeholder="Enter code"]')),
      5000
    );
    await driver
      .findElement(By.css('input[placeholder="Enter code"]'))
      .sendKeys("123456"); // simulate valid OTP
    await driver
      .findElement(By.xpath("//button[contains(text(), 'Verify')]"))
      .click();

    // now wait for redirect
    await driver.wait(until.urlContains("/"), 10000);
  } finally {
    await driver.quit();
  }
}, 20000);

// Add more E2E tests for registration, 2FA, password reset, etc.
