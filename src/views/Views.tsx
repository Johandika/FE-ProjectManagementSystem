// import { Suspense } from 'react'
// import Loading from '@/components/shared/Loading'
// import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
// import appConfig from '@/configs/app.config'
// import PageContainer from '@/components/template/PageContainer'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import { useAppSelector } from '@/store'
// import ProtectedRoute from '@/components/route/ProtectedRoute'
// import PublicRoute from '@/components/route/PublicRoute'
// import AuthorityGuard from '@/components/route/AuthorityGuard'
// import AppRoute from '@/components/route/AppRoute'
// import type { LayoutType } from '@/@types/theme'

// interface ViewsProps {
//     pageContainerType?: 'default' | 'gutterless' | 'contained'
//     layout?: LayoutType
// }

// type AllRoutesProps = ViewsProps

// const { authenticatedEntryPath } = appConfig

// const AllRoutes = (props: AllRoutesProps) => {
//     const userAuthority = useAppSelector((state) => state.auth.user.authority)

//     return (
//         <Routes>
//             <Route path="/" element={<ProtectedRoute />}>
//                 <Route
//                     path="/"
//                     element={<Navigate replace to={authenticatedEntryPath} />}
//                 />
//                 {protectedRoutes.map((route, index) => (
//                     <Route
//                         key={route.key + index}
//                         path={route.path}
//                         element={
//                             <AuthorityGuard
//                                 userAuthority={userAuthority}
//                                 authority={route.authority}
//                             >
//                                 <PageContainer {...props} {...route.meta}>
//                                     <AppRoute
//                                         routeKey={route.key}
//                                         component={route.component}
//                                         {...route.meta}
//                                     />
//                                 </PageContainer>
//                             </AuthorityGuard>
//                         }
//                     />
//                 ))}
//                 <Route path="*" element={<Navigate replace to="/" />} />
//             </Route>
//             <Route path="/" element={<PublicRoute />}>
//                 {publicRoutes.map((route) => (
//                     <Route
//                         key={route.path}
//                         path={route.path}
//                         element={
//                             <AppRoute
//                                 routeKey={route.key}
//                                 component={route.component}
//                                 {...route.meta}
//                             />
//                         }
//                     />
//                 ))}
//             </Route>
//         </Routes>
//     )
// }

// const Views = (props: ViewsProps) => {
//     return (
//         <Suspense fallback={<Loading loading={true} />}>
//             <AllRoutes {...props} />
//         </Suspense>
//     )
// }

// export default Views

import { Suspense, useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import PageContainer from '@/components/template/PageContainer'
import { Routes, Route, Navigate } from 'react-router-dom'
import { injectReducer, useAppDispatch, useAppSelector } from '@/store'
import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import AuthorityGuard from '@/components/route/AuthorityGuard'
import AppRoute from '@/components/route/AppRoute'
import type { LayoutType } from '@/@types/theme'
import reducer from './manajemenProyek/ProyekEdit/store'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

injectReducer('proyekEdit', reducer)

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
    const userAuthority = useAppSelector((state) => state.auth.user?.authority)

    const { pekerjaanActive } = useAppSelector((state) => state.proyekEdit.data)

    console.log('pekerjaanActive', pekerjaanActive)
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute />}>
                <Route
                    path="/"
                    element={<Navigate replace to={authenticatedEntryPath} />}
                />
                {protectedRoutes.map((route, index) => {
                    const routeMeta = { ...route.meta }

                    const custRouteMeta = route.added
                        ? {
                              ...route.meta,
                              header: `Detail Proyek ${pekerjaanActive}`,
                          }
                        : routeMeta

                    // console.log('proyekData dalammmm', proyekData)
                    // console.log(custRouteMeta)
                    return (
                        <Route
                            key={route.key + index}
                            path={route.path}
                            element={
                                <AuthorityGuard
                                    userAuthority={userAuthority}
                                    authority={route.authority}
                                >
                                    <PageContainer
                                        {...props}
                                        {...custRouteMeta}
                                    >
                                        <AppRoute
                                            routeKey={route.key}
                                            component={route.component}
                                            {...custRouteMeta}
                                        />
                                    </PageContainer>
                                </AuthorityGuard>
                            }
                        />
                    )
                })}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
            <Route path="/" element={<PublicRoute />}>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
        </Routes>
    )
}

const Views = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllRoutes {...props} />
        </Suspense>
    )
}

export default Views
