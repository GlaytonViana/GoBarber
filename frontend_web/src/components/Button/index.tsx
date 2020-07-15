import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './style';

// Uma interface que extend outra totalmente sem incrementos, pode ser transformada em um type
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container type="button" {...rest}>
    {children}
  </Container>
);

export default Button;
