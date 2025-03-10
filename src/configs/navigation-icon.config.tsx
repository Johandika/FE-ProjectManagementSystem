import { HiOutlineTemplate } from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    dashboard: <HiOutlineTemplate />,
}

export default navigationIcon
