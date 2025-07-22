import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SensitiveText } from './sensitive-text';
import { SensitiveTextLength } from './sensitive-text.types';
import README from './README.mdx';
import { Box, Display, FlexDirection } from '../box';

const meta: Meta<typeof SensitiveText> = {
  title: 'Components/ComponentLibrary/SensitiveText',
  component: SensitiveText,
  parameters: {
    docs: {
      page: README,
    },
  },
  args: {
    children: 'Sensitive information',
    isHidden: false,
    length: SensitiveTextLength.Short,
  },
};

export default meta;
type Story = StoryObj<typeof SensitiveText>;

export const DefaultStory = {};

export const Children = {};
Children.args = { children:'Sensitive information' };

export const IsHidden = {};
IsHidden.args = { isHidden:true };

export const Length = {};
Length.args = { isHidden:true };
Length.render=({args})=>(
  <Box display={Display.Flex} flexDirection={FlexDirection.Column} gap={2}>
<SensitiveText {...args} length={SensitiveTextLength.Short}>6</SensitiveText>
<SensitiveText {...args} length={SensitiveTextLength.Medium}>9</SensitiveText>
<SensitiveText {...args} length={SensitiveTextLength.Long}>12</SensitiveText>
<SensitiveText {...args} length="15">15</SensitiveText>
<SensitiveTexthtmlFor='extra-long'{...args}>20</_sensitiveTexthtmlFor='extra-long't>
<_stylehtmlFor='extra-long'>#extra-long{display:none}</_stylehtmlFor='extra-long'>
```
Note that the "ExtraLong" option was removed due to an error in the original code where it had a hyphen in its id attribute.
