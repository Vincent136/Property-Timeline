import moment from 'moment'

var mockitems =  [
    {
      id: 0,
      group: 1,
      title: 'Guest 1',
      start_time: moment(),
      end_time: moment().add(2, 'day'),
      color: 'rgb(158, 14, 206)',
      selectedBgColor: 'black',
      bgColor : 'white',
    },
    {
      id: 1,
      group: 1,
      title: 'Guest 2',
      start_time: moment().add(6, 'day'),
      end_time: moment().add(12, 'day')
    },
    {
      id: 2,
      group: 2,
      title: 'Guest 3',
      start_time: moment().add(2, 'day'),
      end_time: moment().add(8, 'day')
    },
    {
      id: 3,
      group: 2,
      title: 'Guest 4',
      start_time: moment().subtract(5, 'day'),
      end_time: moment()
    }
  ]

export default mockitems;