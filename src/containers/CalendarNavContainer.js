import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as CalendarActions from '../actions'
import startOfMonth from 'date-fns/start_of_month';
import addMonths from 'date-fns/add_months';
import format from 'date-fns/format';

import CalendarNav from '../components/CalendarNav'

class CalendarNavContainer extends Component {
  render () {
    const { currentMonthIndex, actions } = this.props
	const currentMonthTitle = format(addMonths(startOfMonth(new Date()), currentMonthIndex), 'MMMM YYYY');

    return (
      <CalendarNav
        nextMonthAction={actions.nextMonth}
        prevMonthAction={actions.prevMonth}
        currentMonthTitle={currentMonthTitle}
      />
    )
  }
}

const mapStateToProps = state => ({
  currentMonthIndex: state.calendar.currentMonthIndex
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(CalendarActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarNavContainer)
