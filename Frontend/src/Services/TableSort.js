function descendingComparator (a, b, orderBy) {

  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator (order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort (array, comparator, orderBy, order) {
  let months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
  let stabilizedThis = array.map((el, index) => [el, index])
  if (orderBy === 'ref_month') {
    stabilizedThis =
      order === 'asc' ? stabilizedThis.sort(
          (a, b) => new Date(a[0].ref_month.split('/')[1], months.indexOf(a[0].ref_month.split('/')[0]), 5) -
            new Date(b[0].ref_month.split('/')[1], months.indexOf(b[0].ref_month.split('/')[0]), 5))
        :
        stabilizedThis.sort(
          (a, b) => new Date(b[0].ref_month.split('/')[1], months.indexOf(b[0].ref_month.split('/')[0]), 5) -
            new Date(a[0].ref_month.split('/')[1], months.indexOf(a[0].ref_month.split('/')[0]), 5))

  } else {
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) {
        return order
      }
      return a[1] - b[1]

    })
  }
  return stabilizedThis.map((el) => el[0])
}

export { getComparator, stableSort }
