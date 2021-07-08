import React from 'react';
import { mount } from 'enzyme';
import memoize from 'lodash.memoize';

import useMenuGroups, { createMenuGroups, DisplayGroup, MAX_VARIANTS_BEFORE_WRAP } from './useMenuGroups';
import { Category, Item, Variant } from '../../types';

export const createTestCategory = (index: number, subgroups?: Category[], items?: Item[]): Category => ({
  name: index && `category${index}`,
  description: index && `description${index}`,
  subgroups,
  items,
});

export const createTestSubCategory = (index: number, items?: Item[]): Category => ({
  name: `category${index}`,
  description: `description${index}`,
  items,
});

const testPricing = memoize((price: string | number) => () => price);

export const createTestItem = (index: number, variants?: Variant[]): Item => ({
  name: `item${index}`,
  description: `description${index}`,
  calories: index % 2 === 0 ? index : undefined,
  pricing: testPricing(index),
  ...(index % 2 === 0 && { strikethrough: true }),
  variants,
});

export const createTestVariant = (index: number): Variant => ({
  name: `variant${index}`,
  pricing: testPricing(index),
  ...(index % 2 === 0 && { strikethrough: true }),
});

const createMaxVariants = () => {
  const variants = [];
  for (let i = 0; i <= MAX_VARIANTS_BEFORE_WRAP; i++) {
    variants.push(createTestVariant(i + 1));
  }
  return variants;
};

test('Should not group variants if less than max wrappable', () => {
  const categories = [
    createTestCategory(
      1,
      [createTestSubCategory(10, [createTestItem(10, [createTestVariant(10)])])],
      [createTestItem(1, [createTestVariant(1), createTestVariant(2), createTestVariant(3)])]
    ),
  ];
  const groups = createMenuGroups(categories, true);
  expect(groups.length).toEqual(2);
  expect(groups[0]).toEqual([
    { type: 'heading', props: { name: 'category1', description: 'description1', isSubHeading: false }, nestedLevel: 0 },
    {
      type: 'item',
      props: {
        name: 'item1',
        description: 'description1',
        calories: undefined,
        pricing: testPricing(1),
        pricingStrategy: undefined,
        timeSpecificPricingRules: undefined,
      },
      nestedLevel: 0,
    },
    {
      type: 'variant',
      props: { name: 'variant1', pricing: testPricing(1) },
      nestedLevel: 0,
    },
    {
      type: 'variant',
      props: { name: 'variant2', pricing: testPricing(2), strikethrough: true },
      nestedLevel: 0,
    },
    {
      type: 'variant',
      props: { name: 'variant3', pricing: testPricing(3) },
      nestedLevel: 0,
    },
  ]);

  expect(groups[1]).toEqual([
    {
      type: 'heading',
      props: { name: 'category10', description: 'description10', isSubHeading: true },
      nestedLevel: 1,
    },
    {
      type: 'item',
      props: {
        name: 'item10',
        description: 'description10',
        calories: 10,
        pricing: testPricing(10),
        pricingStrategy: undefined,
        timeSpecificPricingRules: undefined,
        strikethrough: true,
      },
      nestedLevel: 1,
    },
    {
      type: 'variant',
      props: { name: 'variant10', pricing: testPricing(10), strikethrough: true },
      nestedLevel: 1,
    },
  ]);
});

test('Should group variants if variants count exceeds max wrappable', () => {
  const categories = [createTestCategory(1, [], [createTestItem(1, createMaxVariants())])];
  const groups = createMenuGroups(categories, true);
  expect(groups.length).toEqual(7);
  expect(groups[0]).toEqual([
    { type: 'heading', props: { name: 'category1', description: 'description1', isSubHeading: false }, nestedLevel: 0 },
    {
      type: 'item',
      props: { name: 'item1', calories: undefined, description: 'description1', pricing: testPricing(1) },
      nestedLevel: 0,
    },
    {
      type: 'variant',
      props: { name: 'variant1', pricing: testPricing(1) },
      nestedLevel: 0,
    },
    {
      type: 'variant',
      props: { name: 'variant2', pricing: testPricing(2), strikethrough: true },
      nestedLevel: 0,
    },
  ]);
  expect(groups[1]).toEqual([
    {
      type: 'variant',
      props: { name: 'variant3', pricing: testPricing(3) },
      nestedLevel: 0,
    },
  ]);
  expect(groups[2]).toEqual([
    {
      type: 'variant',
      props: { name: 'variant4', pricing: testPricing(4), strikethrough: true },
      nestedLevel: 0,
    },
  ]);
  expect(groups[3]).toEqual([
    {
      type: 'variant',
      props: { name: 'variant5', pricing: testPricing(5) },
      nestedLevel: 0,
    },
  ]);
  expect(groups[4]).toEqual([
    {
      type: 'variant',
      props: { name: 'variant6', pricing: testPricing(6), strikethrough: true },
      nestedLevel: 0,
    },
  ]);
  expect(groups[5]).toEqual([
    {
      type: 'variant',
      props: { name: 'variant7', pricing: testPricing(7) },
      nestedLevel: 0,
    },
  ]);
  expect(groups[6]).toEqual([
    {
      type: 'variant',
      props: { name: 'variant8', pricing: testPricing(8), strikethrough: true },
      nestedLevel: 0,
    },
    {
      type: 'variant',
      props: { name: 'variant9', pricing: testPricing(9) },
      nestedLevel: 0,
    },
  ]);
});

test('Should group heading with first item if second item exceeds max variants', () => {
  const categories = [createTestCategory(1, [], [createTestItem(1), createTestItem(2, createMaxVariants())])];
  const groups = createMenuGroups(categories, true);
  expect(groups.length).toEqual(8);
  expect(groups[0]).toEqual([
    { type: 'heading', props: { name: 'category1', description: 'description1', isSubHeading: false }, nestedLevel: 0 },
    {
      type: 'item',
      props: { name: 'item1', description: 'description1', calories: undefined, pricing: testPricing(1) },
      nestedLevel: 0,
    },
  ]);
});

test('Should group heading with items in a single category with less than 4 items that dont exceed max variants', () => {
  const categories = [createTestCategory(1, [], [createTestItem(1), createTestItem(2), createTestItem(3)])];
  const groups = createMenuGroups(categories, true);
  expect(groups.length).toEqual(2);
  expect(groups[0]).toEqual([
    { type: 'heading', props: { name: 'category1', description: 'description1', isSubHeading: false }, nestedLevel: 0 },
    {
      type: 'item',
      props: { name: 'item1', description: 'description1', calories: undefined, pricing: testPricing(1) },
      nestedLevel: 0,
    },
    {
      type: 'item',
      props: { name: 'item2', description: 'description2', calories: 2, pricing: testPricing(2), strikethrough: true },
      nestedLevel: 0,
    },
  ]);
  expect(groups[1]).toEqual([
    {
      type: 'item',
      props: { name: 'item3', description: 'description3', calories: undefined, pricing: testPricing(3) },
      nestedLevel: 0,
    },
  ]);
});

test('Should group heading with first two items that dont exceed max variants when there are multiple categories', () => {
  const categories = [
    createTestCategory(1, [], [createTestItem(1), createTestItem(2), createTestItem(3)]),
    createTestCategory(2, [], [createTestItem(1)]),
  ];
  const groups = createMenuGroups(categories, true);
  expect(groups.length).toEqual(2);
  expect(groups[0]).toEqual([
    { type: 'heading', props: { name: 'category1', description: 'description1', isSubHeading: false }, nestedLevel: 0 },
    {
      type: 'item',
      props: { name: 'item1', description: 'description1', calories: undefined, pricing: testPricing(1) },
      nestedLevel: 0,
    },
    {
      type: 'item',
      props: { name: 'item2', description: 'description2', calories: 2, pricing: testPricing(2), strikethrough: true },
      nestedLevel: 0,
    },
    {
      type: 'item',
      props: { name: 'item3', description: 'description3', calories: undefined, pricing: testPricing(3) },
      nestedLevel: 0,
    },
  ]);
  expect(groups[1]).toEqual([
    { type: 'heading', props: { name: 'category2', description: 'description2', isSubHeading: false }, nestedLevel: 0 },
    {
      type: 'item',
      props: { name: 'item1', description: 'description1', calories: undefined, pricing: testPricing(1) },
      nestedLevel: 0,
    },
  ]);
});

test('Should group heading with first two items and last two items of a category with 4 items or more that dont exceed max variants', () => {
  const categories = [
    createTestCategory(
      1,
      [],
      [createTestItem(1), createTestItem(2), createTestItem(3), createTestItem(4), createTestItem(5)]
    ),
  ];
  const groups = createMenuGroups(categories, true);
  expect(groups.length).toEqual(3);
  expect(groups[0]).toEqual([
    { type: 'heading', props: { name: 'category1', description: 'description1', isSubHeading: false }, nestedLevel: 0 },
    {
      type: 'item',
      props: { name: 'item1', description: 'description1', calories: undefined, pricing: testPricing(1) },
      nestedLevel: 0,
    },
    {
      type: 'item',
      props: { name: 'item2', description: 'description2', calories: 2, pricing: testPricing(2), strikethrough: true },
      nestedLevel: 0,
    },
  ]);
  expect(groups[1]).toEqual([
    {
      type: 'item',
      props: { name: 'item3', description: 'description3', calories: undefined, pricing: testPricing(3) },
      nestedLevel: 0,
    },
  ]);
  expect(groups[2]).toEqual([
    {
      type: 'item',
      props: { name: 'item4', description: 'description4', calories: 4, pricing: testPricing(4), strikethrough: true },
      nestedLevel: 0,
    },
    {
      type: 'item',
      props: { name: 'item5', description: 'description5', calories: undefined, pricing: testPricing(5) },
      nestedLevel: 0,
    },
  ]);
});

test('should not wrap categories when wrap disabled', () => {
  const categories = [
    createTestCategory(
      1,
      [],
      [
        createTestItem(1),
        createTestItem(2, [createTestVariant(1), createTestVariant(2), createTestVariant(3)]),
        createTestItem(3, createMaxVariants()),
        createTestItem(4),
        createTestItem(5),
      ]
    ),
    createTestCategory(2, [], [createTestItem(1, createMaxVariants()), createTestItem(2), createTestItem(3)]),
    createTestCategory(3, [], [createTestItem(1), createTestItem(2)]),
  ];
  const groups = createMenuGroups(categories, false);
  expect(groups.length).toEqual(3);
});

test('Should keep hiding props', () => {
  const categories = [
    createTestCategory(
      1,
      [createTestSubCategory(10, [createTestItem(10, [createTestVariant(10)])])],
      [createTestItem(1, [createTestVariant(1), createTestVariant(2), createTestVariant(3)])]
    ),
  ];
  categories[0].hideDescription = true;
  categories[0].subgroups[0].hideName = true;

  categories[0].items[0].hideName = true;
  categories[0].items[0].hideName = true;
  categories[0].subgroups[0].items[0].hideDescription = true;
  categories[0].subgroups[0].items[0].hidePrice = true;

  categories[0].items[0].variants[1].hidePrice = true;

  const groups = createMenuGroups(categories, true);

  expect(groups.length).toEqual(2);
  expect(groups[0]).toEqual([
    {
      type: 'heading',
      props: { name: 'category1', description: 'description1', isSubHeading: false, hideDescription: true },
      nestedLevel: 0,
    },
    {
      type: 'item',
      props: {
        name: 'item1',
        description: 'description1',
        calories: undefined,
        pricing: testPricing(1),
        pricingStrategy: undefined,
        timeSpecificPricingRules: undefined,
        hideName: true,
      },
      nestedLevel: 0,
    },
    {
      type: 'variant',
      props: { name: 'variant1', pricing: testPricing(1) },
      nestedLevel: 0,
    },
    {
      type: 'variant',
      props: { name: 'variant2', pricing: testPricing(2), strikethrough: true, hidePrice: true },
      nestedLevel: 0,
    },
    {
      type: 'variant',
      props: { name: 'variant3', pricing: testPricing(3) },
      nestedLevel: 0,
    },
  ]);

  expect(groups[1]).toEqual([
    {
      type: 'heading',
      props: { name: 'category10', description: 'description10', isSubHeading: true, hideName: true },
      nestedLevel: 1,
    },
    {
      type: 'item',
      props: {
        name: 'item10',
        description: 'description10',
        calories: 10,
        pricing: testPricing(10),
        pricingStrategy: undefined,
        timeSpecificPricingRules: undefined,
        strikethrough: true,
        hideDescription: true,
        hidePrice: true,
      },
      nestedLevel: 1,
    },
    {
      type: 'variant',
      props: { name: 'variant10', pricing: testPricing(10), strikethrough: true },
      nestedLevel: 1,
    },
  ]);
});

describe('useMenuGroups', () => {
  const TestChildComponent: React.FC<{ groups: DisplayGroup[] }> = ({ groups }) => <div>{JSON.stringify(groups)}</div>;
  const TestComponent : React.FC<{ categories: Category[], wrap: boolean }> = ({ categories, wrap }) => {
    const groups = useMenuGroups(categories, wrap);
    return <TestChildComponent groups={groups} />;
  };

  it('should return the same groups array if categories and wrap unchanged', () => {
    const wrapper = mount(<TestComponent categories={[createTestCategory(1, [], [])]} wrap={true} />);

    const groups = wrapper.find(TestChildComponent).prop('groups');

    wrapper.setProps({ categories: [createTestCategory(1, [], [])], wrap: true });

    wrapper.update().find(TestChildComponent).prop('groups').should.equal(groups);
  });

  it('should return groups with a divider if some later category have to name', () => {
    const wrapper = mount(
      <TestComponent
        categories={[createTestCategory(1, [], []), createTestCategory(null, [], [createTestItem(1, [])])]}
        wrap={true}
      />
    );

    wrapper
      .find(TestChildComponent)
      .prop('groups')[1][0]
      .should.eql({ type: 'divider', props: {}, nestedLevel: undefined });
  });

  it('should not have divider if the first category have to name', () => {
    const wrapper = mount(
      <TestComponent categories={[createTestCategory(null, [], [createTestItem(1, [])])]} wrap={true} />
    );

    const groups = wrapper.find(TestChildComponent).prop('groups');
    groups.should.have.length(1);
    groups[0].should.have.length(1);
    groups[0][0].type.should.not.equal('divider');
  });
});
