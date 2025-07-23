import { useSelector } from 'react-redux';
import {
  getCurrentNetwork,
  getInternalAccountByAddress,
  getSelectedAccountCachedBalance,
  getShouldHideZeroBalanceTokens,
  getShowFiatInTestnets,
} from '../../../selectors';
import { TEST_NETWORKS } from '../../../../shared/constants/network';
import { useAccountTotalFiatBalance } from '../../../hooks/useAccountTotalFiatBalance';

export const useBalance = (fromAddress) => {
  const shouldHideZeroBalanceTokens = useSelector(getShouldHideZeroBalanceTokens);
  const currentNetwork = useSelector(getCurrentNetwork);
  const showFiatInTestnets = useSelector(getShowFiatInTestnets);
  const showFiat = TEST_NETWORKS.includes(currentNetwork?.nickname) && !showFiatInTestnets;
const balanceToUse = showFiat ? useSelector(getSelectedAccountCachedBalance) : (() => {
    const fromAccount = useSelector((state) => getInternalAccountByAddress(state, fromAddress));
    return shouldHideZeroBalanceTokens
      ? require('..//..//hooks/useaccounttotalfiyatbalance').default(fromAccount, true).totalWei Balance
      : require('..//..//hooks/useaccounttotalfiyatbalance').default(fromAccount).totalWei Balance;
})();
return !fromAddress ? {} : { balance: balanceToUse };
};
