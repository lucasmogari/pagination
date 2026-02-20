type PageItem =
  | { type: 'page'; page: number; current?: boolean }
  | { type: 'previous'; page?: number }
  | { type: 'next'; page?: number }
  | { type: 'gap'; pages?: number[] }
  | { type: 'first'; page: number; current?: boolean }
  | { type: 'last'; page: number; current?: boolean };

type PaginationCallback = (pageItem: PageItem) => void;

type PaginationOptions = {
  itemsPerPage: number;
  maxPageItems: number;
  gapValues: boolean;
  numbers: boolean;
  arrows: boolean;
  first: boolean;
  last: boolean;
};

export type { PageItem, PaginationCallback, PaginationOptions };

const BOUNDARY_OFFSET = 2;
const MIDDLE_PAGE_CALCULATION_OFFSET = 4;

export default function pagination(
  page: number,
  totalItems: number,
  callback: PaginationCallback,
  options: Partial<PaginationOptions> = {},
): void {
  const itemsPerPage = options.itemsPerPage && options.itemsPerPage > 0 ? options.itemsPerPage : 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 0) return;

  const currentPage = page < 1 ? 1 : page > totalPages ? totalPages : page;

  if (options.first) {
    const pageItem: PageItem = { type: 'first', page: 1 };
    if (currentPage === 1) pageItem.current = true;
    callback(pageItem);
  }

  if (options.arrows) {
    const pageItem: PageItem = { type: 'previous' };
    if (currentPage > 1) pageItem.page = currentPage - 1;
    callback(pageItem);
  }

  if (options.numbers) {
    const maxPageItems =
      options.maxPageItems && options.maxPageItems > 0 ? options.maxPageItems : 1;
    if (totalPages <= maxPageItems) {
      for (let i = 1; i <= totalPages; i++) {
        const pageItem: PageItem = { type: 'page', page: i };
        if (currentPage === i) pageItem.current = true;
        callback(pageItem);
      }
    } else if (maxPageItems === 1) {
      callback({ type: 'page', page: currentPage, current: true });
    } else if (maxPageItems > 4) {
      const getToken = (pageItemIndex: number): number | 'gap' => {
        if (pageItemIndex === 1) {
          return 1;
        } else if (pageItemIndex === maxPageItems) {
          return totalPages;
        } else {
          const boundaryCount = maxPageItems - BOUNDARY_OFFSET;
          const lowerBoundary = boundaryCount;
          const upperBoundary = totalPages - boundaryCount + 1;

          if (currentPage < lowerBoundary) {
            return pageItemIndex <= lowerBoundary ? pageItemIndex : 'gap';
          } else if (currentPage > upperBoundary) {
            const upperStart = totalPages - maxPageItems;
            return pageItemIndex > BOUNDARY_OFFSET ? upperStart + pageItemIndex : 'gap';
          } else {
            const middleStart =
              currentPage -
              Math.ceil((maxPageItems - MIDDLE_PAGE_CALCULATION_OFFSET) / 2) -
              BOUNDARY_OFFSET;
            const penultimatePageItem = maxPageItems - 1;
            return pageItemIndex === BOUNDARY_OFFSET || pageItemIndex === penultimatePageItem
              ? 'gap'
              : pageItemIndex + middleStart;
          }
        }
      };

      const getNumericToken = options.gapValues
        ? (pageItemIndex: number, direction: number): number | null => {
            let idx = pageItemIndex + direction;
            while (idx >= 1 && idx <= maxPageItems) {
              const token = getToken(idx);
              if (token !== 'gap') return token as number;
              idx += direction;
            }
            return null;
          }
        : undefined;

      for (let pageItemIndex = 1; pageItemIndex <= maxPageItems; pageItemIndex++) {
        const token = getToken(pageItemIndex);

        if (token === 'gap') {
          let gapPages: number[] | undefined;

          if (options.gapValues) {
            const prevToken = getNumericToken!(pageItemIndex, -1);
            const nextToken = getNumericToken!(pageItemIndex, 1);

            if (prevToken && nextToken) {
              gapPages = [];
              const start = prevToken + 1;
              const end = nextToken - 1;
              for (let p = start; p <= end; p++) gapPages.push(p);
            }
          }

          const pageItem: PageItem = { type: 'gap' };
          if (gapPages) {
            pageItem.pages = gapPages;
          }
          callback(pageItem);
        } else {
          const pageItem: PageItem = { type: 'page', page: token as number };
          if (currentPage === token) pageItem.current = true;
          callback(pageItem);
        }
      }
    } else {
      const half = Math.floor((maxPageItems - 1) / 2);
      let startPage = Math.max(1, currentPage - half);
      let endPage = Math.min(totalPages, startPage + maxPageItems - 1);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageItems + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        const pageItem: PageItem = { type: 'page', page: i };
        if (currentPage === i) pageItem.current = true;
        callback(pageItem);
      }
    }
  }

  if (options.arrows) {
    const pageItem: PageItem = { type: 'next' };
    if (currentPage < totalPages) pageItem.page = currentPage + 1;
    callback(pageItem);
  }

  if (options.last) {
    const pageItem: PageItem = { type: 'last', page: totalPages };
    if (currentPage === totalPages) pageItem.current = true;
    callback(pageItem);
  }
}
