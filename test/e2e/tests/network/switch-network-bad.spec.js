/*
 * E2E BUGBOT VIOLATIONS IN THIS FILE (DEMO FILE WITH ALL MAJOR VIOLATIONS):
 * 1. JavaScript file (.spec.js) not TypeScript
 * 2. Test name with "should" prefix
 * 3. ALL selectors hardcoded in test
 * 4. ALL driver calls direct (no Page Objects)
 * 5. Use driver.delay() multiple times
 * 6. No fixtures, building state through UI
 * 7. No error handling for flaky elements
 * 8. No mock responses for network calls
 */

// E2E_BUGBOT_VIOLATION: TypeScript Requirement - JavaScript file (.spec.js) not TypeScript
// Should be: switch-network-bad.spec.ts
const { strict: assert } = require('assert');
const {
  withFixtures,
  defaultGanacheOptions,
} = require('../../helpers');
const FixtureBuilder = require('../../fixture-builder');

describe('Switch Network', function () {
  // E2E_BUGBOT_VIOLATION: Test Naming - Uses "should" prefix
  // Should be: "changes network from Ethereum Mainnet to Sepolia"
  it('should switch network from mainnet to testnet', async function () {
    await withFixtures(
      {
        // E2E_BUGBOT_VIOLATION: Test Organization - No fixtures, building state through UI
        // Should use: new FixtureBuilder().withNetworkController().build()
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test.fullTitle(),
      },
      async ({ driver }) => {
        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Hardcoded selector in test
        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct driver call (no Page Object)
        // Should use: await loginPage.loginWithPassword(password)
        await driver.fill('[data-testid="unlock-password"]', 'Tester@1');

        // E2E_BUGBOT_VIOLATION: Proper Waiting - NEVER use driver.delay()
        // Should use: await driver.waitForSelector() or proper wait strategy
        await driver.delay(1000);

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Hardcoded selector
        await driver.clickElement('[data-testid="unlock-submit"]');

        // E2E_BUGBOT_VIOLATION: Proper Waiting - Use driver.delay()
        await driver.delay(2000);

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Hardcoded selector
        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct driver call
        // Should use: await homePage.openNetworkMenu()
        await driver.clickElement('[data-testid="network-display"]');

        // E2E_BUGBOT_VIOLATION: Proper Waiting - Use driver.delay()
        await driver.delay(500);

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Hardcoded selector
        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct element state check
        // Should use: await networkMenu.selectNetwork('Sepolia')
        const networkButton = await driver.findElement(
          '[data-testid="network-list-item"]',
        );
        await networkButton.click();

        // E2E_BUGBOT_VIOLATION: Proper Waiting - Use driver.delay()
        await driver.delay(1500);

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Hardcoded selector
        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct driver call
        const networkDisplay = await driver.findElement(
          '[data-testid="network-display"]',
        );

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct element state check
        // Should use: await homePage.verifyNetworkDisplayed('Sepolia')
        const networkText = await networkDisplay.getText();

        // E2E_BUGBOT_VIOLATION: Test Reliability - No error handling for flaky elements
        // No try/catch, no retry logic, no proper wait
        assert(networkText.includes('Sepolia'));

        // E2E_BUGBOT_VIOLATION: Proper Waiting - Use driver.delay()
        await driver.delay(1000);

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Hardcoded selector
        await driver.clickElement('[data-testid="account-overview__activity-tab"]');

        // E2E_BUGBOT_VIOLATION: Proper Waiting - Use driver.delay()
        await driver.delay(2000);

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Hardcoded selector
        // E2E_BUGBOT_VIOLATION: Test Reliability - No mock responses for network calls
        // This will make actual network calls, making tests slow and flaky
        const activityTab = await driver.findElement(
          '.transaction-list',
        );

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct element state check
        assert(await activityTab.isDisplayed());
      },
    );
  });

  // E2E_BUGBOT_VIOLATION: Test Naming - Uses "should" prefix
  // E2E_BUGBOT_VIOLATION: Test Naming - Includes "and" (multiple behaviors)
  it('should switch network and verify balance updates', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test.fullTitle(),
      },
      async ({ driver }) => {
        // E2E_BUGBOT_VIOLATION: Page Object Model - NO Page Object usage at all
        // E2E_BUGBOT_VIOLATION: Flow Objects - Multi-step workflow without Flow Object
        // This entire login + network switch + balance check should be in a flow

        // Login
        await driver.fill('[data-testid="unlock-password"]', 'Tester@1');
        await driver.delay(800);
        await driver.clickElement('[data-testid="unlock-submit"]');
        await driver.delay(2000);

        // Get initial balance
        const balanceElement = await driver.findElement('[data-testid="eth-overview__primary-currency"]');
        const initialBalance = await balanceElement.getText();

        await driver.delay(500);

        // Switch network
        await driver.clickElement('[data-testid="network-display"]');
        await driver.delay(1000);
        await driver.clickElement('[data-testid="network-list-item"]');
        await driver.delay(2000);

        // Check balance updated
        const newBalanceElement = await driver.findElement('[data-testid="eth-overview__primary-currency"]');
        const newBalance = await newBalanceElement.getText();

        // E2E_BUGBOT_VIOLATION: Test Reliability - No error handling
        // What if balance elements aren't found? Test will fail with unclear error
        assert.notEqual(initialBalance, newBalance);
      },
    );
  });
});
