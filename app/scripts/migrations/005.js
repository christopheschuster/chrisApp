import { cloneDeep } from 'lodash';

const version = 5;

export default {
  version,

  migrate(originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData);
    versionedData.meta.version = version;
    try {
      const state = versionedData.data;
      const newState = selectSubstateForKeyringController(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`chrisApp Migration #5${err.stack}`);
    }
    return Promise.resolve(versionedData);
  },
};

function selectSubstateForKeyringController(state) {
  const { config } = state;
  return {
    ...state,
    KeyringController: {
      vault: state.vault,
      selectedAccount: config.selectedAccount,
      walletNicknames: state.walletNicknames,
    },
  };
}
