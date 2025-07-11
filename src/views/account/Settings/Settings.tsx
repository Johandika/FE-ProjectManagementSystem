import { useState, Suspense, lazy } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { useNavigate } from 'react-router-dom'

// type GetAccountSettingData = AccountSetting

const Profile = lazy(() => import('./components/Profile'))
const Password = lazy(() => import('./components/Password'))

const { TabNav, TabList } = Tabs

const settingsMenu: Record<
    string,
    {
        label: string
        path: string
    }
> = {
    profile: { label: 'Profile', path: 'profile' },
    password: { label: 'Kata Sandi', path: 'password' },
}

const Settings = () => {
    const [currentTab, setCurrentTab] = useState('profile')
    // const [data, setData] = useState<Partial<AccountSetting>>({})

    const navigate = useNavigate()

    // const location = useLocation()

    // const path = location.pathname.substring(
    //     location.pathname.lastIndexOf('/') + 1
    // )

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/app/account/settings/${val}`)
    }

    // const fetchData = async () => {
    //     const response = await apiGetAccountSettingData<GetAccountSettingData>()
    //     setData(response.data)
    // }

    // useEffect(() => {
    //     setCurrentTab(path)
    //     if (isEmpty(data)) {
    //         fetchData()
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    return (
        <Container>
            <AdaptableCard>
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
                    <TabList>
                        {Object.keys(settingsMenu).map((key) => (
                            <TabNav key={key} value={key}>
                                {settingsMenu[key].label}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>
                <div className="px-4 py-6">
                    <Suspense fallback={<></>}>
                        {currentTab === 'profile' && <Profile />}
                        {currentTab === 'password' && <Password />}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default Settings
