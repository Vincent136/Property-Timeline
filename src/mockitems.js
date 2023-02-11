import moment from 'moment'

var mockitems =  [
    {
    id: 0,
    group: 0,
    title: 'Guest 1',
    start_time: moment(),
    end_time: moment().add(5, 'hour')
    },
    {
    id: 1,
    group: 0,
    title: 'Guest 2',
    start_time: moment().add(6, 'hour'),
    end_time: moment().add(12, 'hour')
    },
    {
      id: 2,
      group: 1,
      title: 'Guest 3',
      start_time: moment().add(2, 'hour'),
      end_time: moment().add(8, 'hour')
    },
    {
      id: 3,
      group: 1,
      title: 'Guest 4',
      start_time: moment().subtract(5, 'hour'),
      end_time: moment()
    }
  ]

export default mockitems;