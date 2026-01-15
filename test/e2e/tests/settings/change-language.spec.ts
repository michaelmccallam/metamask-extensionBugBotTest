/*
 * E2E BUGBOT VIOLATIONS IN THIS FILE:
 * 1. Hardcoded selectors in test file (lines 15-33)
 * 2. Direct driver calls in test (lines 36-44, 73-78, 102-107, etc.)
 * 3. Direct element state checks (lines 63-66, 80-83)
 * 4. Helper function with hardcoded selectors instead of Page Object
 * 5. NO Page Object Model usage
 * 6. Test name uses "validate" (vague wording)
 */

import { strict as assert } from 'assert';
import { Suite } from 'mocha';

import { Driver } from '../../webdriver/driver';
import {
  defaultGanacheOptions,
  withFixtures,
  unlockWallet,
} from '../../helpers';
import FixtureBuilder from '../../fixture-builder';

// E2E_BUGBOT_VIOLATION: Page Object Model - Hardcoded selectors in test file
// E2E_BUGBOT_VIOLATION: Page Object Model - NO Page Object Model usage
// Should be defined in a SettingsPage class
const selectors = {
  accountOptionsMenuButton: '[data-testid="account-options-menu-button"]',
  settingsOption: { text: 'Settings', tag: 'div' },
  localeSelect: '[data-testid="locale-select"]',
  ethOverviewSend: '[data-testid="eth-overview-send"]',
  ensInput: '[data-testid="ens-input"]',
  nftsTab: '[data-testid="account-overview__nfts-tab"]',
  labelSpanish: { tag: 'p', text: 'Idioma actual' },
  currentLanguageLabel: { tag: 'p', text: 'Current language' },
  advanceText: { text: 'Avanceret', tag: 'div' },
  waterText: '[placeholder="Søg"]',
  headerTextDansk: { text: 'Indstillinger', tag: 'h3' },
  buttonText: { css: '[data-testid="auto-lockout-button"]', text: 'Gem' },
  dialogText: { text: 'Empfängeradresse ist unzulässig', tag: 'p' },
  accountTooltipText: '[data-original-title="क्लिपबोर्ड पर कॉपी करें"]',
  bridgeTooltipText: '[data-original-title="इस नेटवर्क पर उपलब्ध नहीं है"]',
  hyperText: { text: 'Tudjon meg többet', tag: 'a' },
  headerText: { text: 'الإعدادات', tag: 'h3' },
};

// E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct driver calls in helper function
// E2E_BUGBOT_VIOLATION: Page Object Model - Helper function with hardcoded selectors instead of Page Object
// Should be a method in SettingsPage class
async function changeLanguage(driver: Driver, languageIndex: number) {
  await driver.clickElement(selectors.accountOptionsMenuButton);
  await driver.clickElement(selectors.settingsOption);

  const dropdownElement = await driver.findElement(selectors.localeSelect);
  await dropdownElement.click();

  const options = await dropdownElement.findElements({ css: 'option' });
  await options[languageIndex].click();
}

describe('Settings - general tab @no-mmi', function (this: Suite) {
  // E2E_BUGBOT_VIOLATION: Test Naming - Test name uses "validate" (vague wording)
  // Should be: "changes language to Spanish and persists after refresh"
  it('validate the change language functionality', async function () {
    let languageIndex = 10;

    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
      },

      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);
        await changeLanguage(driver, languageIndex);

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct element state checks
        // Should use Page Object method: await settingsPage.verifyLanguageChanged('Spanish')
        // Validate the label changes to Spanish
        const isLanguageLabelChanged = await driver.isElementPresent(
          selectors.labelSpanish,
        );
        assert.equal(isLanguageLabelChanged, true, 'Language did not change');

        await driver.refresh();

        // Change back to English and verify that the word is correctly changed back to English
        languageIndex = 9;

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct driver calls in test
        // Should use: await settingsPage.selectLanguage(languageIndex)
        const dropdownElement = await driver.findElement(
          selectors.localeSelect,
        );
        await dropdownElement.click();
        const options = await dropdownElement.findElements({ css: 'option' });
        await options[languageIndex].click();

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct element state checks
        const isLabelTextChanged = await driver.isElementPresent(
          selectors.currentLanguageLabel,
        );
        assert.equal(isLabelTextChanged, true, 'Language did not change');
      },
    );
  });

  // E2E_BUGBOT_VIOLATION: Test Naming - Test name uses "validate" (vague wording)
  it('validate "Dansk" language on page navigation', async function () {
    const languageIndex = 6;
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
      },

      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);
        await changeLanguage(driver, languageIndex);

        await driver.assertElementNotPresent('.loading-overlay__spinner');

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct driver calls with hardcoded selector
        await driver.clickElement(selectors.advanceText);

        // E2E_BUGBOT_VIOLATION: Prohibited Patterns - Direct element state checks
        // Confirm that the language change is reflected in search box water text
        const isWaterTextChanged = await driver.isElementPresent(
          selectors.waterText,
        );
        assert.equal(
          isWaterTextChanged,
          true,
          'Water text in the search box does not match with the selected language',
        );

        // Confirm that the language change is reflected in headers
        const isHeaderTextChanged = await driver.isElementPresent(
          selectors.headerTextDansk,
        );
        assert.equal(
          isHeaderTextChanged,
          true,
          'Language change is not reflected in headers',
        );

        // Confirm that the language change is reflected in button
        const isButtonTextChanged = await driver.isElementPresent(
          selectors.buttonText,
        );
        assert.equal(
          isButtonTextChanged,
          true,
          'Language change is not reflected in button',
        );
      },
    );
  });

  // E2E_BUGBOT_VIOLATION: Test Naming - Vague test name
  it('validate "Deutsch" language on error messages', async function () {
    const languageIndex = 7;
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
      },

      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);
        await changeLanguage(driver, languageIndex);
        await driver.navigate();
        await driver.clickElement(selectors.ethOverviewSend);
        await driver.pasteIntoField(
          selectors.ensInput,
          // use wrong checksum address; other inputs don't show error until snaps name-lookup has happened
          '0xAAAA6BF26964aF9D7eEd9e03E53415D37aA96045',
        );

        // Validate the language change is reflected in the dialog message
        const isDialogMessageChanged = await driver.isElementPresent(
          selectors.dialogText,
        );
        assert.equal(
          isDialogMessageChanged,
          true,
          'Language change is not reflected in dialog message',
        );
      },
    );
  });

  it('validate "मानक हिन्दी" language on tooltips', async function () {
    const languageIndex = 19;
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
      },

      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);
        await changeLanguage(driver, languageIndex);
        await driver.navigate();

        // Validate the account tooltip
        const isAccountTooltipChanged = await driver.isElementPresent(
          selectors.accountTooltipText,
        );
        assert.equal(
          isAccountTooltipChanged,
          true,
          'Language changes is not reflected on the account toolTip',
        );

        // Validate the bridge tooltip
        const isBridgeTooltipChanged = await driver.isElementPresent(
          selectors.bridgeTooltipText,
        );
        assert.equal(
          isBridgeTooltipChanged,
          true,
          'Language changes is not reflected on the bridge toolTip',
        );
      },
    );
  });

  it('validate "Magyar" language change on hypertext', async function () {
    const languageIndex = 23;
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
      },

      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);
        // selects "Magyar" language
        await changeLanguage(driver, languageIndex);
        await driver.navigate();
        await driver.clickElement(selectors.nftsTab);

        // Validate the hypertext
        const isHyperTextChanged = await driver.isElementPresent(
          selectors.hyperText,
        );
        assert.equal(
          isHyperTextChanged,
          true,
          'Language change is not reflected on hypertext',
        );
      },
    );
  });

  it('validate "العربية" language change on page indent', async function () {
    const languageIndex = 1;
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test?.fullTitle(),
      },
      async ({ driver }: { driver: Driver }) => {
        await unlockWallet(driver);
        await changeLanguage(driver, languageIndex);

        // Validate the header text
        const isHeaderTextChanged = await driver.isElementPresent(
          selectors.headerText,
        );
        assert.equal(
          isHeaderTextChanged,
          true,
          'Language change is not reflected in headers',
        );
      },
    );
  });
});
