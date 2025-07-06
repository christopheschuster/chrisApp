import merge from 'lodash.merge';
import { RemoteFeatureFlagControllerState } from '@chrisapp/remote-feature-flag-controller';
import { createSelector } from 'reselect';
import { getManifestFlags, ManifestFlags } from '../../shared/lib/manifestFlags';

export type RemoteFeatureFlagsState = {
  chrisapp: {
    remoteFeatureFlags: RemoteFeatureFlagControllerState['remoteFeatureFlags'];
  };
};

export const getRemoteFeatureFlags = createSelector(
  (): ManifestFlags['remoteFeatureFlags'] => getManifestFlags().remoteFeatureFlags,
  (state: RemoteFeatureFlagsState): RemoteFeatureFlagControllerState['remoteFeatureFlags'] =>
    state.chrisapp.remoteFeatureFlags,
  (manifest, state) => merge({}, state, manifest),
);
