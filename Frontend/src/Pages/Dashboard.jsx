import styles from '../Styles/Dashboard.module.scss'
import { api } from '../Services/Api.js'
import { useEffect, useState } from 'react'
import Loading from '../Components/Loading.jsx'
import Charts from '../Components/Charts.jsx'
import { MenuItem, Select } from '@mui/material'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState(null)
  const [client, setClient] = useState("Todos")
  const [clients, setClients] = useState([])

  const getAllData = async () => {
    setLoading(true)
    await api.get('/invoice/all').then((response) => {
      setInvoices(response.data.invoices)
      setLoading(false)
    })
  }

  const getData = async () => {
    setLoading(true)
    await api.get('/invoice/client', { params: { client_number: client } }).then((response) => {
      setInvoices(response.data.invoices)
      setLoading(false)
    })
  }

  const getClients = async () => {
    setLoading(true)
    await api.get('/invoice/clients').then((response) => {
      setClients(response.data.clients)
      setLoading(false)
    })
  }

  useEffect(() => {
    getClients()
    getAllData()
  }, [])

  useEffect(() => {
    if (client !== "Todos") {
      getData()
    } else {
      getAllData()
    }

  }, [client])

  return (
    <div>
      {loading ? <Loading/> :
        <div className={styles.container}>
          <div className={styles.content}>
            <br/>
            <h2>Dashboard</h2>
            <label className={styles.inputLabel}>SELECIONE UM CLIENTE</label>
            <br/>
            <Select
              className={styles.textField}
              IconComponent={(props) => <ExpandCircleDownIcon
                style={{ color: 'green', fontSize: '2rem' }}  {...props}/>}
              required
              id="outlined-required"
              value={client}
              onChange={(e) => setClient(e.target.value)}

            >
              <MenuItem key={`todos`} value={`Todos`} style={{ color: 'green', }}>Todos</MenuItem>
              {clients.map((client, index) =>
                <MenuItem key={index} value={client}
                          style={{
                            color: 'green',
                          }}>{client}</MenuItem>,
              )}
            </Select>
            {invoices && <Charts data={invoices}/>}

          </div>

        </div>
      }

    </div>
  )

}

export default Dashboard
