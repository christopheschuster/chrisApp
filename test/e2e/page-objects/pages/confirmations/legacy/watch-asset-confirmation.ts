import { Driver } from '../../../../webdriver/driver';
import { RawLocator } from '../../../common';

export default class WatchAssetConfirmation {
  private driver: Driver;

  private footerConfirmButton: RawLocator = '[data-testid="page-container-footer-next"]';

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async clickFooterConfirmButton() {
    await this.driver.clickElement(this.footerConfirmButton);
  }
}
