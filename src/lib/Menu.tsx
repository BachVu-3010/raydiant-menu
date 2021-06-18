import * as React from 'react';

interface MenuProps {
  message: string;
}

const Menu: React.FC<MenuProps> = ({ message }) => <div>{message}</div>;

export default Menu;
