import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ZENDESK_URLS from '../../../../../helpers/constants/zendesk-url';
import IconButton from '../../../../../components/ui/icon-button/icon-button-round';
import {
  Box,
  ButtonLink,
  Icon,
  Text,
} from '../../../../../components/component-library';

const SmartAccountUpdateSuccess = () => {
  const t = useI18nContext();
  const history = useHistory();

  const closeAccountUpdatePage = useCallback(() => {
    history.replace('/');
  }, [history]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="calc(100vh * (10/12))"
    >
      <IconButton
        Icon={<Icon name={IconName.Close} />}
        onClick={closeAccountUpdatePage}
        className="smart-account-update__close"
        label=""
      />
      <Icon
        name={IconName.CheckBold}
        color="#57C49A" // Replace with actual successDefault color value if needed.
        size={36} // Xl icon size should be standardized as a number.
      />
      
<Text variant="headingMd" marginBottom={24} marginTop={24}>
{t('smartAccountUpdateSuccessTitle')}
</Text>

<Text variant='bodyMd'>
{t('smartAccountUpdateSuccessMessage')}
</Text>

<ButtonLink 
size='md' 
href= {ZENDESK_URLS.ACCOUNT_UPGRADE}
externalLink>
{t('learnMoreUpperCase')}  
</ButtonLink>   
   </Box>    
};
