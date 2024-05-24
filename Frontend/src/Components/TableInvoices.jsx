import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material'
import styles from '../Styles/TableInvoices.module.scss'
import { useEffect, useMemo, useState } from 'react'
import { getComparator, stableSort } from '../Services/TableSort.js'
import { visuallyHidden } from '@mui/utils'
import { api } from '../Services/Api.js'
import Loading from './Loading.jsx'

const TableInvoices = (props) => {
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('ref_month');
  const [invoices, setInvoices] = useState([])
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [itemsPage, setItemsPage] = useState(10);

  const getTotalDataSize = async () => {
    await api.get('/invoices/size').then((response) => {
      setTotalInvoices(response.data.totalInvoices)
      setLoading(false)
    })
  }

  const getClientTotalDataSize = async () => {
    await api.get('/invoices/client/size', { params: { client_number: props.client } }).then((response) => {
      setTotalInvoices(response.data.totalInvoices)
      setLoading(false)
    })
  }

  const getAllData = async () => {
    setLoading(true)
    await api.get("invoices?offset=" + (itemsPage * activePage) + "&limit=" + itemsPage).then((response) => {
      setInvoices(response.data.invoices)
      setLoading(false)
    })
  }

  const getData = async () => {
    setLoading(true)
    await api.get("/invoice/client/page?offset=" + (itemsPage * activePage) + "&limit=" + itemsPage, { params: { client_number: props.client } }).then((response) => {
      setInvoices(response.data.invoices)
      setLoading(false)
    })
  }
  const headCells = [
    {
      id: 'client_number',
      numeric: false,
      disablePadding: false,
      label: 'Nº DO CLIENTE',
    },
    {
      id: 'ref_month',
      numeric: false,
      disablePadding: false,
      label: 'MÊS REFERÊNCIA',
    },
    {
      id: 'energy_cost',
      numeric: false,
      disablePadding: false,
      label: 'VALOR',
    },
    {
      id: 'energy_quantity',
      numeric: false,
      disablePadding: false,
      label: 'CONSUMO',
    }
  ]

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const visibleRows = useMemo(
    () =>
      stableSort(invoices, getComparator(order, orderBy), orderBy, order).slice(),
    [order, orderBy, invoices],
  );

  const currencyFormat = (value) => {
    return new Intl.NumberFormat('pt-br', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value);
  }

  const handleChangePage = (event, newPage) => {
    setActivePage(newPage);
  };


  useEffect(() => {
    setInvoices([])
    if (props.client !== "Todos") {
      getClientTotalDataSize()
      getData()
    } else {
      getTotalDataSize()
      getAllData()
    }

  }, [props.client, activePage])

  return (
    <>
      {loading ? <Loading/> :
        <>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                {headCells.map((headCell) => (
                  <TableCell
                    className={styles.tableHeaderCell}
                    key={headCell.id}
                    align={'left'}
                    padding={'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell key={'download'} className={styles.tableHeaderCell}>DOWNLOAD DA FATURA</TableCell>
              </TableHead>
              <TableBody>
                {visibleRows.map((invoice) => (
                  <>
                    <TableRow key={invoice.idt_invoice}>
                      <TableCell className={styles.tableCell} align="left"> {invoice.client_number} </TableCell>
                      <TableCell className={styles.tableCell} align="left"> {invoice.ref_month} </TableCell>
                      <TableCell className={styles.tableCell} align="left"> R$ {currencyFormat(invoice.energy_cost)}</TableCell>
                      <TableCell className={styles.tableCell} align="left"> {invoice.energy_quantity} kWh</TableCell>
                      <TableCell className={styles.tableCell} align="left"> <a
                        download={`Fatura_${invoice.ref_month.replaceAll('/', '-')}.pdf`}
                        href={invoice.b64_file}
                      > Download </a> </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[]}
            count={totalInvoices}
            rowsPerPage={itemsPage}
            page={activePage}
            onPageChange={handleChangePage}
          />
        </>

      }
    </>

  )
}

export default TableInvoices
