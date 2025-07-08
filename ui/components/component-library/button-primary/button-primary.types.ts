import type { ButtonBaseStyleUtilityProps } from '../button-base/button-base.types';
import type { PolymorphicComponentPropWithRef } from '../box';

export enum ButtonPrimarySize {
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
}

export type ValidButtonTagType = 'button' | 'a';

export interface ButtonPrimaryStyleUtilityProps extends Omit<ButtonBaseStyleUtilityProps, 'size'> {
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonPrimarySize;
}

export type ButtonPrimaryProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<C, ButtonPrimaryStyleUtilityProps>;

export type ButtonPrimaryComponent = <
  C extends React.ElementType = ValidButtonTagType,
>(
  props: ButtonPrimaryProps<C>,
) => React.ReactElement | null;
