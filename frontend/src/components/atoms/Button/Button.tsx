import type { ElementType } from 'react';
import { Button as MuiButton } from '@mui/material';
import type { ButtonProps as MuiButtonProps, ButtonTypeMap } from '@mui/material/Button';
import type { ExtendButtonBase } from '@mui/material/ButtonBase';

export type ButtonProps<
  RootComponent extends ElementType = 'button',
  AdditionalProps = object,
> = Omit<MuiButtonProps<RootComponent, AdditionalProps>, 'disableRipple'>;

export const Button: ExtendButtonBase<ButtonTypeMap> = ((props: MuiButtonProps) => (
  <MuiButton disableRipple {...props} />
)) as ExtendButtonBase<ButtonTypeMap>;
