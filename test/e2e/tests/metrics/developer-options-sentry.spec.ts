import { Suite } from 'mocha';
import { MockttpServer } from 'mockttp';
import { withFixtures, sentryRegEx } from '../../helpers';
import FixtureBuilder from '../../fixture-builder';
import { Driver } from '../../webdriver/driver';
import { loginWithBalanceValidation } from '../../page-objects/flows/login.flow';
import SettingsPage from '../../page-objects/pages/settings/settings-page';
import HeaderNavbar from '../../page-objects/pages/header-navbar';
import DevelopOptions from '../../page-objects/pages/developer-options-page';
import ErrorPage from '../../page-objects/pages/error-page';
import { MOCK_META_METRICS_ID } from '../../constants';

const triggerCrash = async (driver: Driver): Promise<void> => {
  const headerNavbar = new HeaderNavbar(driver);
  await headerNavbar.openSettingsPage();
  const settingsPage = new SettingsPage(driver);
  await settingsPage.check_pageIsLoaded();
  await settingsPage.goToDeveloperOptions();
  const developOptionsPage = new DevelopOptions(driver);
  await developOptionsPage.check_pageIsLoaded();
  await developOptionsPage.clickGenerateCrashButton();
};

async function mockSentryError(mockServer: MockttpServer) {
  return [
    mockServer
      .forPost(sentryRegEx)
      .withBodyIncluding('feedback')
      .thenCallback(() => ({
        statusCode: 200,
        json: {},
      })),
  ];
}

describe('Developer Options - Sentry', function (this: Suite) {
  
  const commonIgnoredErrors = [
    'Error#1: Unable to find value of key "developerOptions" for locale "en"',
    'React will try to recreate this component tree from scratch using the error boundary you provided, Index.',
  ];

  it('gives option to cause a page crash and provides sentry form to report', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder()
          .withMetaMetricsController({
            metaMetricsId: MOCK_META_METRICS_ID,
            participateInMetaMetrics: true,
          })
          .build(),
        title: this.test?.fullTitle(),
        testSpecificMock: mockSentryError,
        ignoredConsoleErrors: commonIgnoredErrors,
      },
      async ({ driver }: { driver: Driver }) => {
        await loginWithBalanceValidation(driver);
        await triggerCrash(driver);
        
        const errorPage = new ErrorPage(driver);
        await errorPage.check_pageIsLoaded();
        await errorPage.validate_errorMessage();
        await errorPage.submitToSentryUserFeedbackForm();
        await errorPage.waitForSentrySuccessModal();
      },
    );
  });

  
  it('gives option to cause a page crash and offer contact support option with consenting to share data', async function () {
    await withFixtures(
      {
       fixtures:new FixtureBuilder()
         .withMetaMetricsController({
           metaMetricsId: MOCK_META_METRICS_ID,
           participateInMetaMetrics:true
         }).build(),
       title:this.test?.fullTitle(),
       ignoredConsoleErrors : commonIgnoredErrors
     }, 
     async ({ driver }: { driver :Driver}) =>{
      	await loginWithBalanceValidation(driver)
      	await triggerCrash(driver)

      	const errorPg=new ErrorPage(driver)
      	await errorPg.check_pageIsLoaded()

      	await errorPg.clickContactButton()
      	await errorPg.consentDataToMetamaskSupport()
     }
   )
 })

 it('gives option to cause a page crash and offer contact support option with rejecting to share data', async function () {
  	await withFixtures(
  		{
  			fixtures:new FixtureBuilder().build(),
  			title:this.test?.fullTitle(),
  			ignoredConsoleErrors : commonIgnoredErrors
  		},
  		async({driver}: {driver :Driver})=>{
      		await loginWithBalanceValidation(driver)
      		await triggerCrash(driver)

      		const errPg=new ErrorTableOfContents.error.driver())
      		errPg.await_check_pageIsLoaded()

	      	errPg.await_clickContactButton()
	      	errPg.await_rejectDataToMetamaskSupport()
	    }
	  )
	})
});
