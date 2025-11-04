import React from 'react';
import ListingCardMenu, { ListingCardMenuProps } from '../myads/ListingCardMenu';

export type BikeCardMenuProps = ListingCardMenuProps;

const BikeCardMenu: React.FC<BikeCardMenuProps> = (props) => {
  // Reuse shared listing menu so bike features stay in sync
  return <ListingCardMenu {...props} />;
};

export default BikeCardMenu;
