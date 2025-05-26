import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'
import BasicBar from '@/components/custom/BasicBar'
import BasicColumn from '@/components/custom/BasicColumn'
import SimplePie from '@/components/custom/SimplePie'
import SplineArea from '@/components/custom/SplineArea'

const Dashboard = () => {
    return (
        <>
            <div className="mb-4 lg:mb-0">
                <h3>Dashboard</h3>
                <p>Ringkasan data proyek</p>
            </div>
            <div className="grid grid-cols-1 ">
                {/* <SplineArea /> */}
                {/* <BasicBar /> */}
                <BasicColumn />
                {/* <SimplePie /> */}
            </div>
        </>
    )
}

export default Dashboard
