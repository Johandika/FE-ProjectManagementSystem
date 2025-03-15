// implementasi server mock menggunakan MirageJS. MirageJS adalah pustaka JavaScript yang digunakan untuk membuat API palsu (fake APIs) untuk keperluan pengembangan dan pengujian aplikasi frontend, tanpa perlu mengakses server backend nyata.

import { createServer } from 'miragejs'
import appConfig from '@/configs/app.config'
import { notificationListData, searchQueryPoolData } from './data/commonData'
import {
    projectList,
    scrumboardData,
    issueData,
    projectDashboardData,
} from './data/projectData'
import { usersData, userDetailData } from './data/usersData'
import { eventsData, mailData, crmDashboardData } from './data/crmData'
import {
    productsData,
    ordersData,
    orderDetailsData,
    salesDashboardData,
} from './data/salesData'
import { kliensData } from './data/klienData'
import {
    portfolioData,
    walletsData,
    marketData,
    transactionHistoryData,
    cryptoDashboardData,
} from './data/cryptoData'
import {
    settingData,
    settingIntergrationData,
    settingBillingData,
    invoiceData,
    logData,
    accountFormData,
} from './data/accountData'
import {
    helpCenterCategoriesData,
    helpCenterArticleListData,
} from './data/knowledgeBaseData'
import { signInUserData } from './data/authData'

import { commonFakeApi, salesFakeApi, klienFakeApi } from './fakeApi'

const { apiPrefix } = appConfig

export function mockServer({ environment = 'test' }) {
    return createServer({
        environment,
        seeds(server) {
            server.db.loadData({
                notificationListData,
                searchQueryPoolData,
                projectList,
                scrumboardData,
                issueData,
                usersData,
                userDetailData,
                eventsData,
                mailData,
                productsData,
                ordersData,
                orderDetailsData,
                settingData,
                settingIntergrationData,
                settingBillingData,
                invoiceData,
                logData,
                accountFormData,
                portfolioData,
                walletsData,
                marketData,
                transactionHistoryData,
                helpCenterCategoriesData,
                helpCenterArticleListData,
                signInUserData,
                salesDashboardData,
                crmDashboardData,
                projectDashboardData,
                cryptoDashboardData,
                kliensData,
            })
        },
        routes() {
            this.urlPrefix = ''
            this.namespace = ''
            this.passthrough((request) => {
                const isExternal = request.url.startsWith('http')
                const isResource = request.url.startsWith('data:text')
                return isExternal || isResource
            })
            this.passthrough()

            commonFakeApi(this, apiPrefix)
            // projectFakeApi(this, apiPrefix)
            // crmFakeApi(this, apiPrefix)
            salesFakeApi(this, apiPrefix)
            // accountFakeApi(this, apiPrefix)
            // authFakeApi(this, apiPrefix)
            // cryptoFakeApi(this, apiPrefix)
            // knowledgeBaseFakeApi(this, apiPrefix)
            klienFakeApi(this, apiPrefix)
        },
    })
}
