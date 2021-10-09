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
    {hideName || !name || (
      <Styles.Heading isSubHeading={isSubHeading} fontSize={fontSize}>
        {name}
      </Styles.Heading>
    )}
    {hideDescription || !description || (
      <Styles.Description
        fontSize={fontSize}
        noTopPadding={hideName || !name}>{description}
      </Styles.Description>
    )}
  </>
);

export default CategoryHeading;
