import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

class Host extends Component {

  state = {
    period: 1,
  }

  calculateData = () => {
    const { events } = this.props
    const currentHost = this.props.params.host
    const { period } = this.state
    const date = new Date()
    date.setHours(date.getHours() - period)
    let sortedEvents = Immutable.fromJS({})
    events.map(event => {
      const host = event.get('remote_host')
      if (host == currentHost) {
        const eventDate = new Date(event.get('datetime'))
        if (eventDate >= date) {
          const service = event.get('service')
          const eventsOfService = sortedEvents.get(service) ? sortedEvents.get(service) : []
          eventsOfService.push(event)
          sortedEvents = sortedEvents.set(service, eventsOfService)
        }
      }
    })
    return sortedEvents
  }

  render() {
    const { period } = this.state
    const events = this.calculateData()
    const currentHost = this.props.params.host

    const data = []
    events.map((eventsOfService, key) => {
      data.push({
        name: key,
        y: eventsOfService.length
      })
    })

    const config = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Activity from host: ' + currentHost
      },
      tooltip: {
        pointFormat: 'Attacks: <b>{point.y}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
        }
      },
      series: [{
        name: 'Top Attack Hosts',
        data: data
      }],
    }
    return (
      <div>
        <h3 className="title">Host</h3>
        <div className="m-t-3 m-b-2">
          <label>Period:</label>
          <select
            className="form-control"
            style={{ width: 300 }}
            value={period}
            onChange={e => this.setState({ period: e.currentTarget.value })}>
            <option value={1}>Last one hour</option>
            <option value={24}>Last one day</option>
            <option value={168}>Last one week</option>
            <option value={168 * 30}>Last 30 days</option>
            <option value={168 * 180}>Last 6 months</option>
          </select>
        </div>
        <ReactHighcharts config={config} />
        <div className="m-t-3">
          <div>
            Lookup tools:
            <a className="lookup-link" href="" target="_blank">DShield</a>
            <a className="lookup-link" href="" target="_blank">Firyx</a>
            <a className="lookup-link" href="" target="_blank">Twitter</a>
            <a className="lookup-link" href="" target="_blank">Google</a>
            <a className="lookup-link" href="" target="_blank">Virus Total</a>
            <a className="lookup-link" href="" target="_blank">Spamhaus</a>
            <a className="lookup-link" href="" target="_blank">Spamcop</a>
            <a className="lookup-link" href="" target="_blank">Senderbase</a>
          </div>
        </div>
      </div>
    )
  }
}

export default Host
