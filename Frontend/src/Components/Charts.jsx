import styles from '../Styles/Charts.module.scss'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useScreenSize } from '../Services/MediaQuery.js'
import { useEffect, useState } from 'react'
import Loading from './Loading.jsx'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
)
const Charts = (props) => {
  const [loading, setLoading] = useState(true)
  const { isLarge } = useScreenSize()
  const [labels, setLabels] = useState([])
  const [energyTotal, setEnergyTotal] = useState([])
  const [energyQuantity, setEnergyQuantity] = useState([])
  const [energyCompQuantity, setEnergyCompQuantity] = useState([])
  const [energyCompCost, setEnergyCompCost] = useState([])
  let months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

  useEffect(() => {
    setLoading(true)
    props.data.sort((a, b) => new Date(a.ref_month.split('/')[1], months.indexOf(a.ref_month.split('/')[0]), 5) -
      new Date(b.ref_month.split('/')[1], months.indexOf(b.ref_month.split('/')[0]), 5)).forEach((invoice) => {
      setLabels(oldData => [...oldData, invoice.ref_month])
      setEnergyTotal(oldData => [
        ...oldData,
        parseFloat(invoice.scee_cost) + parseFloat(invoice.contribution) + parseFloat(invoice.energy_cost)])
      setEnergyQuantity(
        oldData => [...oldData, parseFloat(invoice.scee_quantity) + parseFloat(invoice.energy_quantity)])
      setEnergyCompQuantity(oldData => [...oldData, invoice.energy_comp_quantity])
      setEnergyCompCost(oldData => [...oldData, Math.abs(invoice.energy_comp_cost)])
    })
    setLoading(false)

  }, [])

  return (
    <div className={styles.columnInvoicesGraph}>
      {loading ? <Loading/> :
        <>
          <Bar
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  align: isLarge ? 'center' : 'start',
                },
                title: {
                  display: true,
                  text: 'Comparativo Mensal - Consumo',
                },
              },
            }}
            data={{
              labels: labels,
              datasets: [
                {
                  label: 'Consumo de Energia Elétrica (kWh)',
                  data: energyQuantity,
                  backgroundColor: 'green',
                },
                {
                  label: 'Energia Compensada (kWh)',
                  data: energyCompQuantity,
                  backgroundColor: 'blue',
                },
              ],
            }}
          />
          <Bar
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  align: isLarge ? 'center' : 'start',
                },
                title: {
                  display: true,
                  text: 'Comparativo Mensal - Valores',
                },
              },
            }}
            data={{
              labels: labels,
              datasets: [
                {
                  label: 'Valor Total Sem GD (R$)',
                  data: energyTotal,
                  backgroundColor: 'red',
                },
                {
                  label: 'Economia GD (R$)',
                  data: energyCompCost,
                  backgroundColor: 'yellow',
                },

              ],
            }}
          />
        </>

      }
    </div>

  )
}

export default Charts
