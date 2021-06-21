import React from 'react';

import CategoryHeading from './CategoryHeading';
import Item from './Item';
import Variant from './Variant';
import * as Styles from './Columns.styles';
import useMenuGroups from './useMenuGroups';
import { Category, PriceFormatter } from '../../types';

const componentTypes = {
  heading: CategoryHeading,
  item: Item,
  variant: Variant,
  divider: () => <Styles.Divider />,
};

interface ColumnsProps {
  measureRef?: React.RefObject<HTMLDivElement> | ((element: HTMLElement) => void);
  categories: Category[];
  fontSize: number;
  columns: number;
  priceFormatter?: PriceFormatter;
  wrap?: boolean;
  hide?: boolean;
}

const Columns: React.FC<ColumnsProps> = ({ measureRef, categories, fontSize, columns, priceFormatter, wrap, hide }) => {
  let groups = useMenuGroups(categories, wrap);

  // Special case when we are rendering one category that wraps, we
  // want the heading to span the full width of the menu.
  let fullWidthHeading;
  if (wrap && categories.length === 1) {
    const [firstGroup, ...otherGroups] = groups;
    const [heading, ...otherGroupItems] = firstGroup;
    if (heading.type === 'heading') {
      fullWidthHeading = <CategoryHeading {...heading.props} fontSize={fontSize} />;
      groups = [otherGroupItems, ...otherGroups];
    }
  }

  return (
    <Styles.Wrapper ref={measureRef} fontSize={fontSize} hide={hide}>
      {fullWidthHeading}
      <Styles.ColumnsWrapper>
        {groups.map((group, groupIndex) => (
          <Styles.ColumnItem key={groupIndex} columns={columns} fontSize={fontSize}>
            {group.map((component, componentIndex) => {
              const Component = componentTypes[component.type];
              return (
                <Styles.Indent key={componentIndex} indentLevel={component.nestedLevel}>
                  <Component {...component.props} priceFormatter={priceFormatter} hide={hide} fontSize={fontSize} />
                </Styles.Indent>
              );
            })}
          </Styles.ColumnItem>
        ))}
      </Styles.ColumnsWrapper>
    </Styles.Wrapper>
  );
};

export default Columns;
