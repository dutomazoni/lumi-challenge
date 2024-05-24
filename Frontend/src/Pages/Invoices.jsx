import { useEffect, useState } from 'react'
import pdfToText from 'react-pdftotext'
import { api } from '../Services/Api.js'
import Loading from '../Components/Loading.jsx'
import styles from '../Styles/Invoices.module.scss'
import { Button, CircularProgress, MenuItem, Select } from '@mui/material'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { toast } from 'react-toastify'
import TableInvoices from '../Components/TableInvoices.jsx'

const Invoices = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingInv, setLoadingInvoices] = useState(false)
  const [client, setClient] = useState('Todos')
  const [clients, setClients] = useState([])

  const extractText = (event) => {
    setLoadingInvoices(true)
    setData([])
    const files = [...event.target.files]
    if(files.length > 12) {
      toast.error(`Número máximo de arquivos é 12!`, {
        icon: false,
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setLoadingInvoices(false)
    } else {
      files.forEach((file) => {
        let fileData = null
        let fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = function () {
          fileData = fileReader.result
        }
        fileReader.onerror = function (error) {
          console.log('Error: ', error)
        }

        pdfToText(file).then((text) => {
          if(!text.includes("CEMIG")) {
            toast.error(`Fatura inválida!`, {
              icon: false,
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            setLoadingInvoices(false)
          } else {
            let clientNumber = text.split('Nº DO CLIENTE')[1].slice(0, 32).replace(/\D/g, '')

            let refMonth = text.split('Referente')[1].slice(36, 46).replace(/\s/g, '')

            let energy = text.split('Energia Elétrica')[1].slice(9, 48)
            let energyKwh = parseFloat(energy.split('   ')[0].replaceAll('.', ''))
            let energyCost = parseFloat(energy.split('   ')[2].replaceAll('.', ''))

            let energySCEE = ''
            let energyKwhSCEE = 0
            let energyCostSCEE = 0
            try {
              if (text.split('Energia SCEE s/ ICMS')[1]) {
                energySCEE = text.split('Energia SCEE s/ ICMS')[1].slice(9, 45)
                energyKwhSCEE = parseFloat(energySCEE.split('   ')[0].replace(/\s/g, '').replaceAll('.', ''))
                energyCostSCEE = parseFloat(energySCEE.split('   ')[2].replace(/\s/g, '').replaceAll('.', ''))
              }
            } catch (e) { console.log(e) }

            let energyComp = ''
            let energyKwhComp = 0
            let energyCostComp = 0
            try {
              if (text.split('Energia compensada GD I')[1]) {
                energyComp = text.split('Energia compensada GD I')[1].slice(9, 48)
                energyKwhComp = parseFloat(energyComp.split('   ')[0].replaceAll('.', ''))
                energyCostComp = parseFloat(energyComp.split('   ')[2].replaceAll('.', ''))
              }
            } catch (e) { console.log(e)}

            let contribution = 0
            try {
              if (text.split('Contrib Ilum Publica Municipal')[1]) {
                contribution = parseFloat(
                  text.split('Contrib Ilum Publica Municipal')[1].slice(0, 9).split('   ')[1].replace(/\s/g, '').
                  replaceAll('.', ''))
              }
            } catch (e) { console.log(e)}

            setData(oldData => [
              ...oldData, {
                client_number: clientNumber,
                ref_month: refMonth,
                energy_cost: energyCost,
                energy_quantity: energyKwh,
                scee_cost: energyCostSCEE,
                scee_quantity: energyKwhSCEE,
                energy_comp_cost: energyCostComp,
                energy_comp_quantity: energyKwhComp,
                contribution: contribution,
                b64_file: fileData,
              }])
            setLoadingInvoices(false)
          }
        })
        .catch(() => console.error('Failed to extract text from pdf'))
      })
    }


  }

  const getClients = async () => {
    setLoading(true)
    await api.get('/invoice/clients').then((response) => {
      setClients(response.data.clients)
      setLoading(false)
    })
  }

  const sendData = async () => {
    setLoadingInvoices(true)
    await api.post('/invoice/create', { invoices: data }).then(() => {
      toast.success(`Faturas enviadas com sucesso!`, {
        icon: false,
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setData([])
      setLoadingInvoices(false)
    }).catch((e) => {
      setLoadingInvoices(false)
      return e
    })

  }

  useEffect(() => {
    getClients()
  }, [])

  return (
    <>
      {loading ? <Loading/> :
        <div className={styles.container}>
          <div className={styles.content}>
            <br/>
            <h2>Biblioteca de Faturas</h2>

            <br/>
            <div className={styles.filterBar}>
              <div className={styles.contentFilterBar}>
                <label className={styles.inputLabel}>SELECIONE UM CLIENTE</label>
                <Select
                  className={styles.textField}
                  IconComponent={(props) => <ExpandCircleDownIcon
                    style={{ color: 'green', fontSize: '2rem' }}  {...props}/>}
                  required
                  id="outlined-required"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}

                >
                  <MenuItem key={`todos`} value={`Todos`} style={{ color: 'green' }}>Todos</MenuItem>
                  {clients.map((client, index) =>
                    <MenuItem key={index} value={client}
                              style={{
                                color: 'green',
                              }}>{client}</MenuItem>,
                  )}
                </Select>
              </div>
              <div className={styles.contentFilterBar}>
                <label className={styles.inputLabel}>ADICIONE NOVAS FATURAS</label>
                <span className={styles.inputLabelSubtext}>Máx. 12 arquivos</span>
                <label htmlFor={'file-upload'} className={styles.fileUpload}>
                  <FileUploadIcon/> Adicionar faturas
                </label>
                <input id="file-upload" type="file" accept="application/pdf" multiple={true} style={{ display: 'none' }}
                       onChange={extractText}/>
                {loadingInv ? <CircularProgress color={'success'} size={'1rem'} style={{ alignSelf: 'center' }}/> :
                  <span style={{ color: 'green' }}>{data.length > 0
                    ? `${data.length} faturas adicionadas`
                    : 'Nenhuma fatura adicionada'}</span>}
                <Button className={styles.btnSend} disabled={data.length === 0} onClick={() => sendData()}>ENVIAR</Button>
              </div>
            </div>
            <br/>
            {client && <TableInvoices client={client}/>}
            <br/><br/>
          </div>
        </div>
      }


    </>
  )

}

export default Invoices
