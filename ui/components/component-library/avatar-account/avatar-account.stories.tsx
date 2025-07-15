
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Box from '../box';
import { AlignItems, Display } from '../../../helpers/constants/design-system';
import AvatarAccount from './avatar-account';
import README from './README.mdx';

export default {
  title: 'Components/ComponentLibrary/AvatarAccount',
  component: AvatarAccount,
  parameters: {
    docs: {
      page: README,
    },
  },
  argTypes: {
    size: { control: 'select', options: Object.values(AvatarAccountSize) },
    address: { control: 'text' },
    variant: { control: 'select', options: Object.values(AvatarAccountVariant) },
  },
  args({
    address = '0x5CfE73b6021E818B776b421B1c4Db2474086a7e1',
    size = AvatarAccountSize.Md,
    variant = AvatarAccountVariant.Jazzicon,
  }) {},
} as Meta<typeof AvatarAccount>;

export const DefaultStory = ({ ...args }) => <AvatarAccount {...args} />;

DefaultStory.storyName = 'Default';

const SizeStory = ({ ...args }) => (
  <Box display={Display.Flex} alignItems={AlignItems.baseline} gap={1}>
    {[AvatarAccountSize.Xs, AvatarAccountSize.Sm, AvatarAccountSize.Md, 
     AvatarAccountSize.Lg, AvatarAccountSize.Xl].map((size) => (
      <Avatar_account {...args} key={size.toString()} size={size} />
     ))}
</Box>
);

const VariantStory = ({ ...args }) => (
  <Box display={Display.Flex} alignItems={AlignItems.baseline} gap={1}>
    {[Avatar_accountVariant.Jazzicon, 
     avatar_accountVariant.Blockies].map((variant) => (
      <Avatar_account {...args} key={variant.toString()} variant={variant} />
     ))}
</Box>
);

const AddressStory = ({ ...args }) => (
   <Box display_{Display.Flex_}=alignItems_{AlignItems_.baseline__}=gap_{gap_}=1>  
   {[0x5CfE73b6021E818B776b421B1c4Db2474086a7e1,"0x0"].map((address)=(
      <Avat_a_c_count{...ag_ns___}{key_{address_.toString()}_=address___}/>
   ))}
   </Box>
);
