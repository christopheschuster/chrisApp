import { DelegationEntry } from '@chrisapp/delegation-controller';
import type { Hex } from '@chrisapp/utils';
import { createSelector } from 'reselect';
import { TransactionMeta, TransactionType } from '@chrisapp/transaction-controller';
import { DailyAllowance, REMOTE_MODES, RemoteModeConfig } from '../../shared/lib/remote-mode';
import { Asset } from '../ducks/send';
import { PENDING_STATUS_HASH } from '../helpers/constants/transactions';
import { getRemoteFeatureFlags, type RemoteFeatureFlagsState } from './remote-feature-flags';
import { type DelegationState, listDelegationEntries } from './delegation';
import { transactionSubSelectorAllChains, transactionSubSelector, getCurrentNetworkTransactions, smartTransactionsListSelector, groupAndSortTransactionsByNonce, getAllNetworkTransactions } from './transactions';
import { getSelectedInternalAccount } from './accounts';

const EIP7702_CONTRACT_ADDRESSES_FLAG = 'confirmations_eip_7702';

type Address = Hex;

export type RemoteModeState = RemoteFeatureFlagsState & DelegationState;

export function getIsRemoteModeEnabled(state: RemoteModeState) {
  return Boolean(getRemoteFeatureFlags(state).vaultRemoteMode);
}

export function getEIP7702ContractAddresses(state: RemoteModeState) {
  return getRemoteFeatureFlags(state)[EIP7702_CONTRACT_ADDRESSES_FLAG];
}

export const getRemoteModeDelegationEntries = (state: RemoteModeState, account: Address, chainId: Hex) => {
  if (!getIsRemoteModeEnabled(state)) return { swapDelegationEntry: null, dailyDelegationEntry: null };
  
  const swapEntries = listDelegationEntries(state, { filter: { from: account, tags: [REMOTE_MODES.SWAP], chainId } });
  const dailyEntries = listDelegationEntries(state, { filter: { from: account, tags: [REMOTE_MODES.DAILY_ALLOWANCE], chainId } });
  
  return { swapDelegationEntry: swapEntries[0], dailyDelegationEntry: dailyEntries[0] };
};

export const getRemoteModeConfig = createSelector(
  (state, hwAccount: Address, chainId: Hex) => getRemoteModeDelegationEntries(state, hwAccount, chainId),
  ({ swapDelegationEntry, dailyDelegationEntry }) => {
    const config: RemoteModeConfig = { swapAllowance: null, dailyAllowance: null };

    if (swapDelegationEntry) {
      const metaObject = swapDelegationEntry.meta ? JSON.parse(swapDelegationEntry.meta) : { allowances: [] };
      config.swapAllowance = { allowances: metaObject.allowances ?? [], delegation: swapDelegationEntry.delegation };
    }

    if (dailyDelegationEntry) {
      const metaObject = dailyDelegationEntry.meta ? JSON.parse(dailyDelegationEntry.meta) : { allowances: [] };
      config.dailyAllowance = { allowances: metaObject.allowances ?? [], delegation: dailyDelegationEntry.delegation };
    }

    return config;
  }
);

type GetRemoteSendAllowanceParams = { from: Address; chainId: Hex; asset?: Asset };

export const getRemoteSendAllowance = (state: RemoteModeState, params: GetRemoteSendAllowanceParams) => {
  if (!getIsRemoteModeEnabled(state)) return null;

  const { from, chainId, asset } = params;
  const entry = listDelegationEntries(state, { filter: { from, chainId, tags: [REMOTE_MODES.DAILY_ALLOWANCE] } })[0];

  if (!entry?.meta) return null;

  const meta = JSON.parse(entry.meta) as { allowances: DailyAllowance[] };
  if (meta.allowances.length === 0) return null;

  const address = asset?.details?.address ?? '';
  const allowance = meta.allowances.find((a) => a.address === address);

  if (!allowance) return null;

  return allowance;
};

export const remoteModeSelectedAddressTxListSelectorAllChain = createSelector(
  getSelectedInternalAccount,
  getAllNetworkTransactions,
  smartTransactionsListSelector,
  (selectedInternalAccount, transactions = [], smTransactions = []) => transactions
    .filter(({ txParamsOriginal }: TransactionMeta) => txParamsOriginal?.from === selectedInternalAccount.address)
    .filter(({ type }: TransactionMeta) => type !== TransactionType.incoming)
    .concat(smTransactions)
);

export const remoteModeSelectedAddressTxListSelector = createSelector(
  getSelectedInternalAccount,
  getCurrentNetworkTransactions,
  smartTransactionsListSelector,
  (selectedInternalAccount, transactions = [], smTransactions = []) => transactions
    .filter(({ txParamsOriginal }: TransactionMeta) => txParamsOriginal?.from === selectedInternalAccount.address)
    .filter(({ type }: TransactionMeta) => type !== TransactionType.incoming)
    .concat(smTransactions)
);

export const remoteModeTransactionsSelectorAllChains = createSelector(
  transactionSubSelectorAllChains,
  remoteModeSelectedAddressTxListSelectorAllChain,
  (subSelectorTxList = [], selectedAddressTxList = []) => [...subSelectorTxList.concat(selectedAddressTxList)].sort((a, b) => b.time - a.time)
);

export const remoteModeTransactionsSelector = createSelector(
  transactionSubSelector,
  remoteModeSelectedAddressTxListSelector,
  (subSelectorTxList = [], selectedAddressTxList = []) => [...subSelectorTxList.concat(selectedAddressTxList)].sort((a, b) => b.time - a.time)
);

export const remoteModeNonceSortedTransactionsSelectorAllChains = createSelector(
  remoteModeTransactionsSelectorAllChains,
  (transactions = []) => groupAndSortTransactionsByNonce(transactions)
);

export const remoteModeNonceSortedTransactionsSelector = createSelector(
  remoteModeTransactionsSelector,
  (transactions = []) => groupAndSortTransactionsByNonce(transactions)
);

export const remoteModeNonceSortedPendingTransactionsSelector = createSelector(
  remoteModeNonceSortedTransactionsSelector,
  (transactions = []) => transactions.filter(({ primaryTransaction }) => primaryTransaction.status in PENDING_STATUS_HASH)
);

export const remoteModeNonceSortedPendingTransactionsSelectorAllChains = createSelector(
  remoteModeNonceSortedTransactionsSelectorAllChains,
  (transactions = []) => transactions.filter(({ primaryTransaction }) => primaryTransaction.status in PENDING_STATUS_HASH)
);

export const remoteModeNonceSortedCompletedTransactionsSelectorAllChains = createSelector(
  remoteModeNonceSortedTransactionsSelectorAllChains,
  (transactions = []) => transactions.filter(({ primaryTransaction }) => !(primaryTransaction.status in PENDING_STATUS_HASH)).reverse()
);

export const remoteModeNonceSortedCompletedTransactionsSelector = createSelector(
  remoteModeNonceSortedTransactionsSelector,
  (transactions = []) => transactions.filter(({ primaryTransaction }) => !(primaryTransaction.status in PENDING_STATUS_HASH)).reverse()
);
