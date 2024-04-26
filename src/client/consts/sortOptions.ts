export enum SortDirection {
  Ascending,
  Descending
}

export enum SortCriterion {
  Name,
  DateCreated
}

export const sortOptions = [
  {
    id: 1,
    value: {
      criterion: SortCriterion.DateCreated,
      direction: SortDirection.Descending
    },
    title: 'Новіші'
  },
  {
    id: 2,
    value: {
      criterion: SortCriterion.DateCreated,
      direction: SortDirection.Ascending
    },
    title: 'Старіші'
  },
  {
    id: 3,
    value: {
      criterion: SortCriterion.Name,
      direction: SortDirection.Ascending
    },
    title: `За ім'ям (А - Я)`
  },
  {
    id: 4,
    value: {
      criterion: SortCriterion.Name,
      direction: SortDirection.Descending
    },
    title: `За ім'ям (Я - А)`
  }
]
