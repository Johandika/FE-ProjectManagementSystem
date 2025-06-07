import { useEffect } from 'react'
import CalendarView from '@/components/shared/CalendarView'
import Container from '@/components/shared/Container'
import EventDialog, { EventParam } from './components/EventDialog'
import reducer, {
    // getEvents,
    updateEvent,
    setSelected,
    openDialog,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import type {
    EventDropArg,
    EventClickArg,
    DateSelectArg,
} from '@fullcalendar/core'

injectReducer('crmCalendar', reducer)

function getDate(dayString: string) {
    const today = new Date()
    const year = today.getFullYear().toString()
    let month = (today.getMonth() + 1).toString()

    if (month.length === 1) {
        month = '0' + month
    }

    return dayString.replace('YEAR', year).replace('MONTH', month)
}

export const events = [
    {
        id: '1',
        title: 'Proyek1',
        start: '2025-05-20',
        end: '2025-06-10',
        eventColor: 'red',
    },
    {
        id: '2',
        title: 'Proyek2',
        start: '2025-06-15',
        end: '2025-07-13',
        eventColor: 'green',
    },
    {
        id: '3',
        title: 'Propyek3',
        start: '2025-06-08',
        end: '2025-06-12',
        eventColor: 'blue',
    },
]

const Calendar = () => {
    const dispatch = useAppDispatch()
    // const events = useAppSelector((state) => state.crmCalendar.data.eventList)

    // useEffect(() => {
    //     dispatch(getEvents())
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    const onCellSelect = (event: DateSelectArg) => {
        const { start, end } = event
        dispatch(
            setSelected({
                type: 'NEW',
                start: dayjs(start).format(),
                end: dayjs(end).format(),
            })
        )
        dispatch(openDialog())
    }

    const onEventClick = (arg: EventClickArg) => {
        const { start, end, id, title, extendedProps } = arg.event
        dispatch(
            setSelected({
                type: 'EDIT',
                eventColor: extendedProps.eventColor,
                title,
                start,
                end,
                id,
            })
        )
        dispatch(openDialog())
    }

    const onSubmit = (data: EventParam, type: string) => {
        let newEvents = cloneDeep(events)
        console.log('data', data)
        console.log('type', type)

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
        dispatch(updateEvent(newEvents))
    }

    const onEventChange = (arg: EventDropArg) => {
        const newEvents = cloneDeep(events).map((event) => {
            if (arg.event.id === event.id) {
                const { id, extendedProps, start, end, title } = arg.event
                event = {
                    id,
                    start: dayjs(start).format(),
                    end: dayjs(end).format(),
                    title,
                    eventColor: extendedProps.eventColor,
                }
            }
            return event
        })
        dispatch(updateEvent(newEvents))
    }

    return (
        <Container className="h-full">
            <CalendarView
                editable
                selectable
                events={events}
                eventClick={onEventClick}
                select={onCellSelect}
                eventDrop={onEventChange}
            />
            <EventDialog submit={onSubmit} />
        </Container>
    )
}

export default Calendar
