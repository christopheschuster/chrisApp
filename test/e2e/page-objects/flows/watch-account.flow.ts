import { Driver } from '../../webdriver/driver';
import HomePage from '../pages/home/homepage';
import AccountListPage from '../pages/account-list-page';

export async function watchEoaAddress(driver: Driver, address: string): Promise<void> {
  const homePage = new HomePage(driver);
  await homePage.headerNavbar.openAccountMenu();
  const accountListPage = new AccountListPage(driver);
  await accountListPage.check_pageIsLoaded();
  await accountListPage.addEoaAccount(address);
  await homePage.check_pageIsLoaded();
}
