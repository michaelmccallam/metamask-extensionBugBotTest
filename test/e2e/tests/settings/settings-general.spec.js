/*
 * E2E BUGBOT VIOLATIONS IN THIS FILE:
 * 1. Keep as JavaScript (.spec.js) file
 * 2. Test names with "checks" (vague) and mixing behaviors
 * 3. Hardcoded selectors in test (not using Page Object)
 * 4. Direct driver calls (no Page Object usage)
 * 5. Test names that combine multiple actions
 * 6. No Page Object pattern at all
 */

// E2E_BUGBOT_VIOLATION: TypeScript Requirement - JavaScript file (.spec.js) not TypeScript
// Should be: settings-general.spec.ts
const {
  defaultGanacheOptions,
  openMenuSafe,
  unlockWallet,
  withFixtures,
} = require('../../helpers');
const FixtureBuilder = require('../../fixture-builder');

describe('Settings', function () {
  // E2E_BUGBOT_VIOLATION: Test Naming - Uses "checks" (vague verb)
  // E2E_BUGBOT_VIOLATION: Test Naming - Implicit "and" (checks jazzicon and blockies)
  // Should be: "displays both Jazzicon and Blockies icon options"
  it('checks jazzicon and blockies icons', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test.fullTitle(),
      },
      async ({ driver }) => {
        await unlockWallet(driver);

        // goes to the settings screen
        await openMenuSafe(driver);

        // E2E_BUGBOT_VIOLATION: Page Object Model - NO Page Object usage
        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct driver call with hardcoded selector
        // Should use: await settingsPage.openSettings()
        await driver.clickElement({ text: 'Settings', tag: 'div' });

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Hardcoded selector in test
        // Should be in SettingsPage class: await settingsPage.verifyJazziconActive()
        // finds the jazzicon toggle turned on
        await driver.findElement(
          '[data-testid="jazz_icon"] .settings-page__content-item__identicon__item__icon--active',
        );

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct driver calls with hardcoded selectors
        // Should use: await settingsPage.verifyIconOptionDisplayed('Jazzicons')
        await driver.waitForSelector({
          tag: 'h6',
          text: 'Jazzicons',
        });

        await driver.waitForSelector({
          tag: 'h6',
          text: 'Blockies',
        });
      },
    );
  });

  // E2E_BUGBOT_VIOLATION: Test Naming - Uses "should" prefix
  // E2E_BUGBOT_VIOLATION: Test Naming - Implicit "and" (navigate to settings and verify)
  it('should navigate to settings and verify options are displayed', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test.fullTitle(),
      },
      async ({ driver }) => {
        await unlockWallet(driver);

        // E2E_BUGBOT_VIOLATION: Page Object Model - NO Page Object usage
        await openMenuSafe(driver);

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Hardcoded selectors
        await driver.clickElement({ text: 'Settings', tag: 'div' });

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct driver calls
        await driver.waitForSelector({
          tag: 'h4',
          text: 'General',
        });

        await driver.findElement('[data-testid="advanced-setting-gas-fee-customization"]');
      },
    );
  });
});
