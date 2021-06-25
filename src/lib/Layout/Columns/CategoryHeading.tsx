import React from 'react';
import * as Styles from './CategoryHeading.styles';

interface CategoryHeadingProps {
  name?: string;
  description?: string;
  isSubHeading?: boolean;
  fontSize?: number;
  hideName?: boolean;
  hideDescription?: boolean;
}

const CategoryHeading: React.FC<CategoryHeadingProps> = ({
  name,
  description,
  isSubHeading = false,
  fontSize,
  hideName = false,
  hideDescription = false,
}) => (
  <>
    {hideName || (
      <Styles.Heading isSubHeading={isSubHeading} fontSize={fontSize}>
        {name}
      </Styles.Heading>
    )}
    {hideDescription || <Styles.Description fontSize={fontSize}>{description}</Styles.Description>}
  </>
);

export default CategoryHeading;
