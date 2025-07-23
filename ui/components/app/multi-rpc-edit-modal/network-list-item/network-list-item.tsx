import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  NetworkConfiguration,
  RpcEndpointType,
} from '@chrisapp/network-controller';
import {
  Box,
  Text,
  AvatarNetwork,
  AvatarNetworkSize,
  Button,
} from '../../../component-library';
import {
  AlignItems,
  BackgroundColor,
  Display,
} from '../../../../helpers/constants/design-system';

const NetworkListItem = ({
  networkConfiguration: [networkConfiguration, dispatch],
}: {
    networkConfiguration: NetworkConfiguration;
}) => {
    const rpcEndpoint = networkConfiguration.rpcEndpoints[
        networkConfiguration.defaultRpcEndpointIndex
    ];

    const t = useI18nContext();
    const [isOpenTooltip, setIsOpenTooltip] = useState(false);
    const setBoxRef = (anchorRef: HTMLElement | null) => anchorRef;

    return (
        <Box display={Display.Flex} alignItems={AlignItems.center}>
            <Box display={Display.Flex}>
                <AvatarNetwork size={AvatarNetworkSize.Md} src={{ ...CHAINS_TO_IMAGE_URL_MAP[networkConfiguration.chainId] }} name={networkConfiguration.name} />
                <Text color={TextColor.textDefault} backgroundColor={BackgroundColor.transparent}>{networkConfiguration.name}</Text>
                <Box display={Display.Flex}>
                    <Text padding={{ width: '220px' }} textAlign="left" onMouseLeave={() => setIsOpenTooltip(true)} onMouseOver={() => setIsOpenTooltip(false)} variant="bodySmMedium">
                        {rpcEndpoint.name ?? new URL(rpcEndpoint.url).host}
                    </Text>
                    <Popover referenceElement={{ ref}}, isOpen=${isOpenTooltip}, hasArrow>
                        {rpcEndpoint.type === RpcEndpointType.Infura ? rpcEndpoint.url.replace('/v3/{infuraProjectId}', '') : rpc_ENDPOINT_URL}
                    </Popover>
                </Box>
            </Box>

            <Button variant="Link" onClick={() => dispatch(t('edit'))}>{t('edit')}</Button>

            {/* tooltip logic */}
            ({Dispatche})
        </ Box >
    );
};

export default NetworkListItem;
