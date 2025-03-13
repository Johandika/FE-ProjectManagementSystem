import type { NavigationTree } from '@/@types/navigation'
import appsNavigationConfig from './apps.navigation.config'

const navigationConfig: NavigationTree[] = [
    ...appsNavigationConfig,
    // ...authNavigationConfig,
    // ...uiComponentNavigationConfig,
    // ...pagesNavigationConfig,
    // ...docNavigationConfig,
]

export default navigationConfig
