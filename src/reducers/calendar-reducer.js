import guid from '../utils/uuid'
import startOfMonth from 'date-fns/start_of_month'
import endOfMonth from 'date-fns/end_of_month'
import startOfWeek from 'date-fns/start_of_week'
import getISOWeek from 'date-fns/get_iso_week'
import setISOWeek from 'date-fns/set_iso_week'
import addMonths from 'date-fns/add_months'
import addDays from 'date-fns/add_days'

/**
 * createCalendarMonth
 * createCalendarMonth creates a new calender month
 * from the first week to the last in that month
 *
 */
const createCalendarMonth = (startWeek, endWeek) => {
  const monthArray = []
  // TODO: Fix this as it doesnt work for december
  // For August this would start on weekIndex = 31 and go to the endWeek = 35 (4)
  for (
    let weekIndex = startWeek, weekArrayIndex = 0;
    weekIndex < endWeek + 1;
    weekIndex++, weekArrayIndex++
  ) {
    const weekUuid = guid()

    // Push a week object into the monthArray
    monthArray.push({
      uuid: weekUuid,
      weekIndex,
      index: weekArrayIndex,
      days:
        Array(7)
        .fill({ id: 0 }) // Fill the array with 7 blank days
        .map((item, index) => {
          return {
            uuid: guid(),
            parentWeekUuid: weekUuid, // Keep a track of the partent
			date: addDays(startOfWeek(setISOWeek(new Date(), weekIndex)), index),
            weekIndex,
            index: index,
            reminders: [] // Create blank reminders within the day
          }
        })
    });
  }

  return monthArray
}
const today = new Date();
// Gets the current month start week index based on 52 weeks in a year
const initialStartWeek = getISOWeek(startOfMonth(today));
// Gets the current month end week index based on 52 weeks in a year
const initialEndWeek = getISOWeek(endOfMonth(today));
const currentMonth = createCalendarMonth(initialStartWeek, initialEndWeek);

// Initial State
const initialState = {
  currentMonthIndex: 0,
  month: currentMonth,
  year: { 0: currentMonth } // keep a track of the months in the year
}

function calendarReducer (state = initialState, action) {
  switch (action.type) {
    case 'PREV_MONTH': {
      const prevMonthIndex = state.currentMonthIndex - 1
	  const updatedStartWeek = getISOWeek(addMonths(startOfMonth(today), prevMonthIndex));
	  const updatedEndWeek = getISOWeek(addMonths(endOfMonth(today), prevMonthIndex));

      const updatedYearCalendar = {
        ...state.year,
        [state.currentMonthIndex]: state.month, // Save the current month
        [prevMonthIndex]: state.year[prevMonthIndex] ?  state.year[prevMonthIndex] : createCalendarMonth(updatedStartWeek, updatedEndWeek)
      }

      return {
        ...state,
        currentMonthIndex: prevMonthIndex,
        month: updatedYearCalendar[prevMonthIndex],
        year: updatedYearCalendar
      }
    }
    case 'NEXT_MONTH': {
      const nextMonthIndex = state.currentMonthIndex + 1
	  const updatedStartWeek = getISOWeek(addMonths(startOfMonth(today), nextMonthIndex));
	  const updatedEndWeek = getISOWeek(addMonths(endOfMonth(today), nextMonthIndex));

      const updatedYearCalendar = {
        ...state.year,
        [state.currentMonthIndex]: state.month,  // Save the current month
        [nextMonthIndex]: state.year[nextMonthIndex] ?  state.year[nextMonthIndex] : createCalendarMonth(updatedStartWeek, updatedEndWeek)
      }

      return {
        ...state,
        currentMonthIndex: nextMonthIndex,
        month: updatedYearCalendar[nextMonthIndex],
        year: updatedYearCalendar
      }
    }
    case 'ADD_REMINDER': {
      const updatedMonth = state.month.map((week, index) => {
        if (action.payload.weekIndex === index) {
          const dayToUpdate = week.days[action.payload.weekdayIndex]

          dayToUpdate.reminders.push({
            text: '',
			date: new Date(),
            category: 'home',
            open: true,
            newReminder: true,
            uuid: guid(),
            parentDayUuid: week.days[action.payload.weekdayIndex].uuid,
            grandparentUuid: week.uuid
          })
        }

        return week
      })

      return {
        ...state,
        month: updatedMonth
      }
    }
    case 'DELETE_REMINDER': {
      const updatedMonth = state.month.map((week, index) => {
        if (action.payload.weekIndex === index) {
          const dayToUpdate = week.days[action.payload.weekdayIndex]
          dayToUpdate.reminders = dayToUpdate.reminders.filter(reminder => reminder.uuid !== action.payload.reminder.uuid)
        }

        return week
      })

      return {
        ...state,
        month: updatedMonth
      }
    }
    case 'EDIT_REMINDER': {
      const updatedMonth = state.month.map((week, index) => {
        if (action.payload.weekIndex !== index) {
          return week
        }

        const dayToUpdate = week.days[action.payload.weekdayIndex]
        dayToUpdate.reminders = dayToUpdate.reminders.map((reminder) => {
          if (reminder.uuid !== action.payload.reminder.uuid) {
            return reminder
          }

          return {
            ...reminder,
            ...action.payload.reminder,
			updateTime: new Date(),
          }
        })

        return week
      })

      return {
        ...state,
        month: updatedMonth
      }
    }
    default:
      return state
  }
}

export default calendarReducer
