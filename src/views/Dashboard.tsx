import Holding from '@/components/custom/Holding'

const Dashboard = () => {
    return (
        <div>
            <div className="mb-4 lg:mb-0">
                <h3>Dashboard</h3>
                <p>Ringkasan data proyek</p>
            </div>
            <div className="grid grid-cols-1 ">
                <Holding />
            </div>
        </div>
    )
}

export default Dashboard
