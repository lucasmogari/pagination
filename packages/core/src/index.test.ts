import { expect, test, describe } from 'vitest';
import type { PageItem, PaginationOptions } from './index.js';
import pagination from './index.js';

const collect = (page: number, totalItems: number, options: Partial<PaginationOptions>) => {
  return pagination(page, totalItems, (item) => item, {
    itemsPerPage: 5,
    ...options,
  });
};

const getPages = (items: PageItem[]) => items.filter((i) => i.type === 'page');
const getGaps = (items: PageItem[]) => items.filter((i) => i.type === 'gap');

describe('Basic functionality', () => {
  test('no items returns empty', () => {
    expect(collect(1, 0, { numbers: true })).toEqual([]);
  });

  test('single page', () => {
    const items = collect(1, 5, { numbers: true });
    expect(getPages(items)).toHaveLength(1);
    expect(getPages(items)[0].page).toBe(1);
  });

  test('arrows only', () => {
    const items = collect(5, 50, { arrows: true });
    expect(items.map((i) => i.type)).toEqual(['previous', 'next']);
    const arrowItems = items.filter(i => i.type !== 'gap');
    expect(arrowItems[0].page).toBe(4);
    expect(arrowItems[1].page).toBe(6);
  });

  test('first and last buttons', () => {
    const items = collect(5, 50, { first: true, last: true, numbers: true });
    expect(items[0].type).toBe('first');
    expect(items[items.length - 1].type).toBe('last');
  });
});

describe('Page bounds', () => {
  test('page < 1 defaults to page 1', () => {
    const items = collect(0, 50, { numbers: true, maxPageItems: 5 });
    const current = getPages(items).find((p) => p.current);
    expect(current?.page).toBe(1);
  });

  test('page > totalPages defaults to last page', () => {
    const items = collect(100, 50, { numbers: true, maxPageItems: 5 });
    const current = getPages(items).find((p) => p.current);
    expect(current?.page).toBe(10);
  });
});

describe('Arrow states', () => {
  test('previous has no page on first page', () => {
    const items = collect(1, 50, { arrows: true });
    const prev = items.find((i) => i.type === 'previous');
    expect(prev?.page).toBeUndefined();
  });

  test('previous has page when not on first', () => {
    const items = collect(5, 50, { arrows: true });
    const prev = items.find((i) => i.type === 'previous');
    expect(prev?.page).toBe(4);
  });

  test('next has no page on last page', () => {
    const items = collect(10, 50, { arrows: true });
    const next = items.find((i) => i.type === 'next');
    expect(next?.page).toBeUndefined();
  });

  test('next has page when not on last', () => {
    const items = collect(5, 50, { arrows: true });
    const next = items.find((i) => i.type === 'next');
    expect(next?.page).toBe(6);
  });
});

describe('All pages fit', () => {
  test('shows all pages when totalPages <= maxPageItems', () => {
    const items = collect(3, 25, { numbers: true, maxPageItems: 10 });
    const pages = getPages(items);
    expect(pages.map((p) => p.page)).toEqual([1, 2, 3, 4, 5]);
    expect(getGaps(items)).toHaveLength(0);
  });
});

describe('maxPageItems = 1', () => {
  test('shows only current page', () => {
    const items = collect(5, 50, { numbers: true, maxPageItems: 1 });
    const pages = getPages(items);
    expect(pages).toHaveLength(1);
    expect(pages[0].page).toBe(5);
    expect(pages[0].current).toBe(true);
  });
});

describe('maxPageItems = 2 (no gaps)', () => {
  test('page 1', () => {
    const items = collect(1, 50, { numbers: true, maxPageItems: 2 });
    expect(getPages(items).map((p) => p.page)).toEqual([1, 2]);
  });

  test('page 5', () => {
    const items = collect(5, 50, { numbers: true, maxPageItems: 2 });
    expect(getPages(items).map((p) => p.page)).toEqual([5, 6]);
  });

  test('page 9', () => {
    const items = collect(9, 50, { numbers: true, maxPageItems: 2 });
    expect(getPages(items).map((p) => p.page)).toEqual([9, 10]);
  });

  test('page 10', () => {
    const items = collect(10, 50, { numbers: true, maxPageItems: 2 });
    expect(getPages(items).map((p) => p.page)).toEqual([9, 10]);
  });
});

describe('maxPageItems = 3 (no gaps)', () => {
  test('page 1', () => {
    const items = collect(1, 50, { numbers: true, maxPageItems: 3 });
    expect(getPages(items).map((p) => p.page)).toEqual([1, 2, 3]);
  });

  test('page 5', () => {
    const items = collect(5, 50, { numbers: true, maxPageItems: 3 });
    expect(getPages(items).map((p) => p.page)).toEqual([4, 5, 6]);
  });

  test('page 10', () => {
    const items = collect(10, 50, { numbers: true, maxPageItems: 3 });
    expect(getPages(items).map((p) => p.page)).toEqual([8, 9, 10]);
  });
});

describe('maxPageItems = 4 (no gaps)', () => {
  test('page 1', () => {
    const items = collect(1, 50, { numbers: true, maxPageItems: 4 });
    expect(getPages(items).map((p) => p.page)).toEqual([1, 2, 3, 4]);
  });

  test('page 5', () => {
    const items = collect(5, 50, { numbers: true, maxPageItems: 4 });
    expect(getPages(items).map((p) => p.page)).toEqual([4, 5, 6, 7]);
  });

  test('page 10', () => {
    const items = collect(10, 50, { numbers: true, maxPageItems: 4 });
    expect(getPages(items).map((p) => p.page)).toEqual([7, 8, 9, 10]);
  });
});

describe('maxPageItems = 5 with no gaps', () => {
  test('page 1: gap on right', () => {
    const items = collect(1, 50, { numbers: true, maxPageItems: 5 });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 2, 3, 10]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].pages).toBeUndefined();
  });

  test('page 5: gaps on both sides', () => {
    const items = collect(5, 50, { numbers: true, maxPageItems: 5 });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 5, 10]);
    expect(gaps).toHaveLength(2);
    expect(gaps[0].pages).toBeUndefined();
    expect(gaps[1].pages).toBeUndefined();
  });

  test('page 10: gap on left', () => {
    const items = collect(10, 50, { numbers: true, maxPageItems: 5 });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 8, 9, 10]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].pages).toBeUndefined();
  });
});

describe('maxPageItems = 5 with gaps', () => {
  test('page 1: gap on right', () => {
    const items = collect(1, 50, { numbers: true, maxPageItems: 5, gapValues: true });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 2, 3, 10]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].pages).toEqual([4, 5, 6, 7, 8, 9]);
  });

  test('page 5: gaps on both sides', () => {
    const items = collect(5, 50, { numbers: true, maxPageItems: 5, gapValues: true });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 5, 10]);
    expect(gaps).toHaveLength(2);
    expect(gaps[0].pages).toEqual([2, 3, 4]);
    expect(gaps[1].pages).toEqual([6, 7, 8, 9]);
  });

  test('page 10: gap on left', () => {
    const items = collect(10, 50, { numbers: true, maxPageItems: 5, gapValues: true });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 8, 9, 10]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].pages).toEqual([2, 3, 4, 5, 6, 7]);
  });
});

describe('maxPageItems = 7 with gaps - 10 pages', () => {
  test('page 1', () => {
    const items = collect(1, 50, { numbers: true, maxPageItems: 7, gapValues: true });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 2, 3, 4, 5, 10]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].pages).toEqual([6, 7, 8, 9]);
  });

  test('page 5', () => {
    const items = collect(5, 50, { numbers: true, maxPageItems: 7, gapValues: true });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 4, 5, 6, 10]);
    expect(gaps).toHaveLength(2);
    expect(gaps[0].pages).toEqual([2, 3]);
    expect(gaps[1].pages).toEqual([7, 8, 9]);
  });

  test('page 7', () => {
    const items = collect(7, 50, { numbers: true, maxPageItems: 7, gapValues: true });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 6, 7, 8, 9, 10]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].pages).toEqual([2, 3, 4, 5]);
  });

  test('page 10', () => {
    const items = collect(10, 50, { numbers: true, maxPageItems: 7, gapValues: true });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 6, 7, 8, 9, 10]);
    expect(gaps).toHaveLength(1);
  });
});

describe('maxPageItems = 7 with gaps - 15 pages', () => {
  test('page 1', () => {
    const items = collect(1, 75, { numbers: true, maxPageItems: 7 });
    const pages = getPages(items);
    expect(pages.map((p) => p.page)).toEqual([1, 2, 3, 4, 5, 15]);
  });

  test('page 8', () => {
    const items = collect(8, 75, { numbers: true, maxPageItems: 7 });
    const pages = getPages(items);
    const gaps = getGaps(items);

    expect(pages.map((p) => p.page)).toEqual([1, 7, 8, 9, 15]);
    expect(gaps).toHaveLength(2);
  });

  test('page 15', () => {
    const items = collect(15, 75, { numbers: true, maxPageItems: 7 });
    const pages = getPages(items);
    expect(pages.map((p) => p.page)).toEqual([1, 11, 12, 13, 14, 15]);
  });
});

describe('Current page tracking', () => {
  test('marks current page correctly', () => {
    const items = collect(5, 50, { numbers: true, maxPageItems: 7 });
    const pages = getPages(items);
    const current = pages.filter((p) => p.current);

    expect(current).toHaveLength(1);
    expect(current[0].page).toBe(5);
  });

  test('marks first page as current when using first button', () => {
    const items = collect(1, 50, { first: true, numbers: true });
    const firstButton = items.find((i) => i.type === 'first');
    expect(firstButton?.current).toBe(true);
  });

  test('marks last page as current when using last button', () => {
    const items = collect(10, 50, { last: true, numbers: true });
    const lastButton = items.find((i) => i.type === 'last');
    expect(lastButton?.current).toBe(true);
  });
});

describe('Complex scenarios', () => {
  test('all features enabled', () => {
    const items = collect(5, 100, {
      first: true,
      last: true,
      arrows: true,
      numbers: true,
      maxPageItems: 7,
    });

    expect(items[0].type).toBe('first');
    expect(items[1].type).toBe('previous');
    expect(items[items.length - 2].type).toBe('next');
    expect(items[items.length - 1].type).toBe('last');
  });

  test('itemsPerPage affects total pages', () => {
    const items1 = collect(1, 100, { numbers: true, itemsPerPage: 10, maxPageItems: 20 });
    const items2 = collect(1, 100, { numbers: true, itemsPerPage: 20, maxPageItems: 20 });

    const pages1 = getPages(items1);
    const pages2 = getPages(items2);

    expect(Math.max(...pages1.map((p) => p.page!))).toBe(10);
    expect(Math.max(...pages2.map((p) => p.page!))).toBe(5);
  });

  test('invalid itemsPerPage defaults to 1', () => {
    const items = collect(1, 10, { numbers: true, itemsPerPage: 0, maxPageItems: 20 });
    const pages = getPages(items);
    expect(pages.length).toBe(10);
  });

  test('invalid maxPageItems defaults to 1', () => {
    const items = collect(5, 50, { numbers: true, maxPageItems: 0 });
    const pages = getPages(items);
    expect(pages.length).toBe(1);
    expect(pages[0].page).toBe(5);
  });
});
