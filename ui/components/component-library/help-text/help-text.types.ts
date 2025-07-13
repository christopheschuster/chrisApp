import PropTypes from 'prop-types';
import type { TextStyleUtilityProps } from '../text';
import type { PolymorphicComponentPropWithRef } from '../box';
import { Severity, TextColor } from '../../../helpers/constants/design-system';

export enum HelpTextSeverity {
  Danger = Severity.Danger,
  Warning = Severity.Warning,
  Success = Severity.Success,
  Info = Severity.Info,
}

export interface HelpTextStyleUtilityProps extends TextStyleUtilityProps {
  severity?: HelpTextSeverity | Severity;
  color?: TextColor;
  children: string | PropTypes.ReactNodeLike;
  className?: string;
  'data-testid'?: string;
}

export type HelpTextProps<C extends React.ElementType> =
PolymorphicComponentPropWithRef<C, HelpTextStyleUtilityProps>;

export type HelpTextComponent = <C extends React.ElementType = 'span'>(
props: HelpTextProps<C>
) => React.ReactElement | null;
