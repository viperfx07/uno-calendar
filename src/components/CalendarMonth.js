import React from 'react'
import PropTypes from 'prop-types'
import isSameDay from 'date-fns/is_same_day'
import compareDate from 'date-fns/compare_asc'
import getDay from 'date-fns/get_day'
import formatDate from 'date-fns/format'

import ReminderItem from './ReminderItem'

const propTypes = {
  disabled: PropTypes.bool
}

class CalendarMonth extends React.Component {
  constructor (props) {
    super(props)

    this.renderWeeks = this.renderWeeks.bind(this)
  }

  handleDoubleClick (weekIndex, weekdayIndex, weekdayDate) {
    // If day is in the past, dont allow click
	if (compareDate(new Date(), weekdayDate) > 0) {
		return;
    }

    this.props.actions.addReminder(weekIndex, weekdayIndex)
  }

  getDayClass (day) {
	const today = new Date();
	
    const classes = ['week__day']

	if(isSameDay(today, day)){
      classes.push('week__day--today')
    }

	if (compareDate(today, day) > 0) {
      classes.push('week__day--past')
    }

	if(getDay(day) === 0 || getDay(day) === 6){
      classes.push('week__day--weekend');
    }

    return classes.join(' ')
  }

  getTitle(weekdayDate) {
	if (compareDate(new Date(), weekdayDate) > 0) {
		return '';
	}
	return 'Double click to add reminder';
  }

  renderWeeks (week, index) {
    const { month, actions } = this.props

    return month.map((week, index) => (
      <div key={week.uuid} className='week'>
        {week.days.map((weekday, index) => (
          <div
            key={weekday.uuid}
            className={this.getDayClass(weekday.date)}
			onDoubleClick={() => this.handleDoubleClick(week.index, weekday.index, weekday.date)}
			title={this.getTitle(weekday.date)}
          >
			{formatDate(weekday.date, 'D')}
            {weekday.reminders.map((reminder) => (
              <ReminderItem
                key={reminder.uuid}
                reminder={reminder}
                weekIndex={week.index}
                weekdayIndex={weekday.index}
                editReminder={actions.editReminder}
                deleteReminder={actions.deleteReminder}
              />
            ))}
          </div>
        ))}
      </div>
    ))
  }

  render () {
    return (
      <div className='calendar__month'>
        {this.renderWeeks()}
      </div>
    )
  }
}

CalendarMonth.propTypes = propTypes

export default CalendarMonth
