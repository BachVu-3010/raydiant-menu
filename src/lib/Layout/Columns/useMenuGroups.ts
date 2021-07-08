import useDeepMemo from '../../utils/useDeepMemo';
import { Category, Item, Pricing, Calories } from '../../types';

export const MAX_VARIANTS_BEFORE_WRAP = 8;

export type DisplayType = 'heading' | 'item' | 'variant' | 'divider';
interface DisplayItemProps {
  name?: string;
  description?: string;
  calories?: Calories;
  pricing?: Pricing;
  strikethrough?: boolean;
  hideName?: boolean;
  hideDescription?: boolean;
  hidePrice?: boolean;
  isSubHeading?: boolean;
}
export interface DisplayItem {
  type: DisplayType;
  props: DisplayItemProps;
  nestedLevel: number;
}
export type DisplayGroup = DisplayItem[];

// createMenuGroups will convert categories to a flat list of groups
// where each item is an array of component types that must wrap together.
export function createMenuGroups(categories: Category[], shouldWrapCategories?: boolean): DisplayGroup[] {
  const groups: DisplayGroup[] = [];
  let currentGroup: DisplayGroup = [];

  const commitGroup = () => {
    if (currentGroup.length) {
      groups.push(currentGroup);
      currentGroup = [];
    }
  };

  const addToGroup = (type: DisplayType, props: DisplayItemProps, nestedLevel?: number) => {
    currentGroup.push({ type, props, nestedLevel });
  };

  const addItemToGroups = (categoriesCount: number, itemsCount: number, nestedLevel: number = 0) => (item: Item, itemIndex: number) => {
    const variants = item.variants || [];
    const variantsCount = variants.length;
    let startGroupedVariants = [];
    let endGroupedVariants = [];
    let wrappingVariants = [];

    // Allow variants to wrap if there are more than 8 but group the first two
    // with the item and the last two so they wrap together. If there are less
    // than 8 variants, group them all with the item.
    if (variantsCount > MAX_VARIANTS_BEFORE_WRAP) {
      // Commit the group if we are past the first item and the current
      // item exceeds the max number of variants.
      if (itemIndex > 0 && shouldWrapCategories) {
        commitGroup();
      }

      // Add item to current group.
      addToGroup(
        'item',
        {
          name: item.name,
          description: item.description,
          calories: item.calories,
          pricing: item.pricing,
          strikethrough: item.strikethrough,
          hideName: item.hideName,
          hideDescription: item.hideDescription,
          hidePrice: item.hidePrice,
        },
        nestedLevel
      );

      startGroupedVariants = variants.slice(0, 2);
      endGroupedVariants = variants.slice(variantsCount - 2, variantsCount);
      wrappingVariants = variants.slice(2, variantsCount - 2);

      // Add the first grouped variants with the item.
      startGroupedVariants.forEach((variant) => {
        addToGroup(
          'variant',
          {
            name: variant.name,
            pricing: variant.pricing,
            strikethrough: variant.strikethrough,
            hidePrice: variant.hidePrice,
          },
          nestedLevel
        );
      });

      // Commit the current group before adding the ungrouped variants,
      // which may also contain the category heading.
      if (shouldWrapCategories) {
        commitGroup();
      }

      // These variants are allowed to wrap so commit the group after
      // adding each one.
      wrappingVariants.forEach((variant) => {
        addToGroup(
          'variant',
          {
            name: variant.name,
            pricing: variant.pricing,
            strikethrough: variant.strikethrough,
            hidePrice: variant.hidePrice,
          },
          nestedLevel
        );
        if (shouldWrapCategories) {
          commitGroup();
        }
      });

      // These variants must be grouped so they wrap together.
      endGroupedVariants.forEach((variant) => {
        addToGroup(
          'variant',
          {
            name: variant.name,
            pricing: variant.pricing,
            strikethrough: variant.strikethrough,
            hidePrice: variant.hidePrice,
          },
          nestedLevel
        );
      });
      if (shouldWrapCategories) {
        commitGroup();
      }
    } else {
      // Add item to current group.
      addToGroup(
        'item',
        {
          name: item.name,
          description: item.description,
          calories: item.calories,
          pricing: item.pricing,
          strikethrough: item.strikethrough,
          hideName: item.hideName,
          hideDescription: item.hideDescription,
          hidePrice: item.hidePrice,
        },
        nestedLevel
      );

      // Add all of the item's variants to the group.
      variants.forEach((variant) => {
        addToGroup(
          'variant',
          {
            name: variant.name,
            pricing: variant.pricing,
            strikethrough: variant.strikethrough,
            hidePrice: variant.hidePrice,
          },
          nestedLevel
        );
      });

      const hasOneCategory = categoriesCount === 1;
      const hasLessThan4Items = itemsCount < 4;
      const isSecondItem = itemIndex === 1;
      const isNotFirstTwoItems = itemIndex >= 1;
      const isNot2ndLastItem = itemIndex !== itemsCount - 2;
      const isLastItem = itemIndex === itemsCount - 1;
      const shouldCommitGroup =
        (hasLessThan4Items && isSecondItem && hasOneCategory) || (isNotFirstTwoItems && isNot2ndLastItem) || isLastItem;

      if (shouldCommitGroup && shouldWrapCategories) {
        commitGroup();
      }
    }
  };

  const addCategoryToGroups = (categoriesCount: number, nestedLevel = 0) => (category: Category) => {
    // Start a new group for every category.
    commitGroup();

    if ((category.name && !category.hideName) || (category.description && !category.hideDescription)) {
      addToGroup(
        'heading',
        {
          name: category.name,
          description: category.description,
          hideName: category.hideName,
          hideDescription: category.hideDescription,
          isSubHeading: nestedLevel > 0,
        },
        nestedLevel
      );
    } else if (groups.length > 0) {
      addToGroup('divider', {});
    }

    const items = category.items || [];
    items.forEach(addItemToGroups(categoriesCount, items.length, nestedLevel));

    const subgroups = category.subgroups || [];
    subgroups.forEach(addCategoryToGroups(subgroups.length, nestedLevel + 1));
  };

  categories.forEach(addCategoryToGroups(categories.length));

  // Commit any uncommitted groups.
  commitGroup();

  return groups;
}

export default (categories: Category[], wrap: boolean) => useDeepMemo(createMenuGroups, [categories, wrap]);
