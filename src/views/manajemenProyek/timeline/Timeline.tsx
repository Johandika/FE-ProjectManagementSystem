import { useEffect, useState } from 'react'
import CalendarView from '@/components/shared/CalendarView'
import Container from '@/components/shared/Container'
import EventDialog, { TimelineParam } from './components/TimelineDialog'
import reducer, {
    updateTimeline,
    setSelected,
    openDialog,
    useAppDispatch,
    useAppSelector,
    getTimelines,
} from './store'
import { injectReducer } from '@/store'
import cloneDeep from 'lodash/cloneDeep'
import type { EventClickArg } from '@fullcalendar/core'
import { Loading } from '@/components/shared'

injectReducer('crmCalendar', reducer)

const Timeline = () => {
    const dispatch = useAppDispatch()
    const events = useAppSelector(
        (state) => state.crmCalendar.data.timelineList.data || []
    )

    const loading = useAppSelector((state) => state.crmCalendar.data.loading)

    // Hapus useState untuk dateRange

    useEffect(() => {
        // Ambil semua data timeline hanya sekali saat komponen dimuat.
        // Kirim parameter yang menandakan untuk mengambil semua data,
        // atau kosongkan jika API Anda mendukungnya.
        // Contoh: mengambil data untuk setahun penuh.
        const data = { awal: '2025-01-01', akhir: '2025-12-31' }
        dispatch(getTimelines(data))
    }, [dispatch]) // Dependency hanya dispatch, sehingga hanya berjalan sekali.

    const onEventClick = (arg: EventClickArg) => {
        const { start, end, id, title, extendedProps } = arg.event
        dispatch(
            setSelected({
                type: 'EDIT',
                timelineColor: extendedProps.eventColor,
                title,
                start,
                end,
                id,
            })
        )
        dispatch(openDialog())
    }

    const onSubmit = (data: TimelineParam, type: string) => {
        let newEvents = cloneDeep(events)

        if (type === 'NEW') {
            newEvents.push(data)
        }

        if (type === 'EDIT') {
            newEvents = newEvents.map((event) => {
                if (data.id === event.id) {
                    event = data
                }
                return event
            })
        }
        dispatch(updateTimeline(newEvents))
    }

    // Hapus fungsi handleDatesSet

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                <CalendarView
                    events={events}
                    eventClick={onEventClick}
                    // Hapus prop onDatesSet
                />
                <EventDialog submit={onSubmit} />
            </Loading>
        </Container>
    )
}

export default Timeline
