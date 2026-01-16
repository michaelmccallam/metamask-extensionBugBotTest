/*
 * E2E BUGBOT VIOLATIONS IN THIS FILE:
 * 1. Vague test name "hides the token when clicked" (when clicked is redundant)
 * 2. Test organization - mixing token verification and hiding operations
 * 3. Building complex state inline in test instead of dedicated fixture methods
 * 4. Page Object method names not descriptive (check_tokenItemNumber)
 * 5. NOT alphabetically sorted Page Object members (assumed)
 * 6. Missing checkPageIsLoaded() pattern
 */

import { toHex } from '@metamask/controller-utils';
import { withFixtures } from '../../helpers';
import FixtureBuilder from '../../fixture-builder';
import HomePage from '../../page-objects/pages/homepage';
import { loginWithBalanceValidation } from '../../page-objects/flows/login.flow';

// E2E_BUGBOT_VIOLATION: Test Organization - Vague describe block name
// Should be more specific: "Token visibility management"
describe('Add hide token', function () {
  // E2E_BUGBOT_VIOLATION: Test Naming - Vague test name "when clicked" is redundant
  // Should be: "removes token from display when hidden"
  it('hides the token when clicked', async function () {
    await withFixtures(
      {
        // E2E_BUGBOT_VIOLATION: Test Organization - Complex inline fixture building
        // Should use: new FixtureBuilder().withTestToken('TST').build()
        fixtures: new FixtureBuilder()
          .withTokensController({
            allTokens: {
              [toHex(1337)]: {
                '0x5cfe73b6021e818b776b421b1c4db2474086a7e1': [
                  {
                    address: '0x86002be4cdd922de1ccb831582bf99284b99ac12',
                    decimals: 4,
                    image: null,
                    isERC721: false,
                    symbol: 'TST',
                  },
                ],
              },
            },
            tokens: [
              {
                address: '0x86002be4cdd922de1ccb831582bf99284b99ac12',
                decimals: 4,
                image: null,
                isERC721: false,
                symbol: 'TST',
              },
            ],
          })
          .build(),
        title: this.test?.fullTitle(),
      },
      async ({ driver }) => {
        await loginWithBalanceValidation(driver);
        const homepage = new HomePage(driver);

        // E2E_BUGBOT_VIOLATION: Page Object Model - Missing checkPageIsLoaded() pattern
        // Should call: await homepage.checkPageIsLoaded()

        // E2E_BUGBOT_VIOLATION: Page Object Model - Method name not descriptive
        // check_tokenItemNumber should be verifyTokenCount() or assertTokenCount()
        await homepage.check_tokenItemNumber(2);

        // E2E_BUGBOT_VIOLATION: Test Organization - Mixing verification and action
        // This test verifies count, verifies display, hides token, verifies count again
        // Should be split into separate focused tests
        await homepage.check_tokenAmountIsDisplayed('0 TST');

        await homepage.hideToken('TST');
        await homepage.check_tokenItemNumber(1);
      },
    );
  });
});
