type generatePageNumbersPropsType = {
  currentPage: number;
  totalPages: number;
  pageNumbersToShow?: number;
};

export const generatePageNumbers = ({
  currentPage,
  totalPages,
  pageNumbersToShow = 5, // Отображаем 5 страниц вместо 3
}: generatePageNumbersPropsType) => {
  const currentPageNumber = currentPage <= totalPages ? currentPage : totalPages;
  const halfPagesToShow = Math.floor(pageNumbersToShow / 2);

  let startPage: number;
  let endPage: number;

  if (totalPages <= pageNumbersToShow) {
    startPage = 1;
    endPage = totalPages;
  } else if (currentPageNumber <= halfPagesToShow + 1) {
    startPage = 1;
    endPage = pageNumbersToShow;
  } else if (currentPageNumber >= totalPages - halfPagesToShow) {
    startPage = totalPages - pageNumbersToShow + 1;
    endPage = totalPages;
  } else {
    startPage = currentPageNumber - 1;
    endPage = currentPageNumber + 1;
  }

  let pageNumbers: (string | number)[] = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  if (startPage > 1) {
    pageNumbers = [1, startPage > 2 ? "..." : 2, ...pageNumbers];
  }

  if (endPage < totalPages) {
    pageNumbers = [...pageNumbers, endPage < totalPages - 1 ? "..." : totalPages - 1, totalPages];
  }

  return pageNumbers;
};
