import { useState, useEffect } from 'react';
import Timeline, {
  TimelineMarkers,
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  CustomHeader,
  TodayMarker,
  CursorMarker,
} from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import Modal from 'react-modal';
import MoveDialog from './MoveDialog';
import DetailDialog from './DetailDialog';

import mockitems from './mockitems';
import mockgroups from './mockgroups';
import apiGroups from './apiGroups';

import "./App.css"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');


function App() {
  const [items, setItems] = useState(mockitems);
  const [roomGroups, setRoomGroups] = useState([]);
  const [propertyGroups, setPropertyGroups] = useState([]);
  const [groups, setGroups] = useState([]);
  const [clickedItems, setClickedItems] = useState({});
  const [groupOpened, setGroupOpened] = useState({});

  const [detailOpen, setDetailOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);

  const handleCanvasDoubleClick = (groupId, time) => {
    

    console.log('Canvas double clicked', groupId, moment(time).format())
  }

  const handleItemDoubleClick = (itemId, _, time) => {
    setClickedItems(items.filter(item => item.id === itemId))

    openDetail();

    console.log('Double Click: ' + itemId, moment(time).format())
  }

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {

    function moveItem(item) {
      var diff = (item.end_time - item.start_time)

      const startTime = moment(dragTime)
      startTime.set({h: 12, m: 0, s: 0, ms: 0})

      const endTime = moment(dragTime + diff)
      endTime.set({h: 12, m: 0, s: 0, ms: 0})

      item.group = newGroupOrder
      item.start_time =  startTime
      item.end_time = endTime
    }

    let newitems = [...items]

    newitems.map( 
      item => item.id === itemId
        ? moveItem(item)
        : item
    )
    
    setItems(newitems)
    openMove()
 
    console.log('Moved', itemId, dragTime, newGroupOrder)
  }

  
  const handleItemResize = (itemId, time, edge) => {
    

    function setSize(item) {
      console.log(item.start_time.toDate())
      // console.log(newTime.toDate())
      if ( edge === 'left') {
        time = moment(time)
        time.set({h: 14, m: 0, s: 0, ms: 0})
        const monthTime = moment(time).format('MMM')
        const dayTime = moment(time).format('DD')
        const itemStartDate = item.start_time.format('DD')
        const itemStartMonth = item.start_time.toDate('MMM')

        if ((itemStartDate !== monthTime) && (itemStartMonth !== dayTime)) item.start_time = time;
      }else {
        time = moment(time)
        time.set({h: 12, m: 0, s: 0, ms: 0})

        const monthTime = moment(time).format('MMM')
        const dayTime = moment(time).format('DD')
        const itemEndDate = item.end_time.format('DD')
        const itemEndMonth = item.end_time.toDate('MMM')
        if ((itemEndDate !== monthTime) && (itemEndMonth !== dayTime)) item.end_time = time;
      }
    }

    let newitems = [...items]

    newitems.map( 
      item => item.id === itemId
        ? setSize(item)
        : item
    )

    setItems(newitems)
    openMove()

    console.log('Resized', itemId, time, edge)
  }


  const openDetail = () => {
    setDetailOpen(true);
  }

  const closeDetail = () => {
    setDetailOpen(false);
  }

  const openMove = () => {
    setMoveOpen(true);
  };


  const closeMove = () => {
    setMoveOpen(false);
  };

  const groupRenderer = ({ group }) => {
    if (group.type === 'Property') {
      return (
        <div className="custom-group property"
            onClick={() => 
              setGroupOpened({...groupOpened, [group.id]: !groupOpened[group.id]})
            }>
          <span className="title">{group.title}</span>
        </div>
      )
    } else {
      return (
        <div className="custom-group room">
          <div className="room-mark">

          </div>
          <span className="title">{group.title}</span>
        </div>
      )
    }
  }

  const itemRender = ({item, itemContext, getItemProps, getResizeProps}) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()

    return (
      <div {...getItemProps({
        style: {
          height: 30,
          backgroundColor: itemContext.selected ? '#EAEAEA' : '#FFFFFF',
          color: itemContext.selected ? 'black' : 'black',
          border: itemContext.selected ? '1px solid #F69322' : '1px solid #EAEAEA',
        }
      })}>
{itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}

      <div
      className="rct-item-content"
      style={{ 
       }}
      >
        {itemContext.title}
      </div>
      {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
      </div>
    )
  }

  useEffect(() => {

    const propertyGroups = []
    const roomGroups = []

    let dictId = {

    }
    let id = 1

    for (const key in apiGroups.data)
    {

      apiGroups.data[key].map(unit => {
          const split_name = unit.unit_name.split("-")
          if (!dictId[split_name[0]]) {
            propertyGroups.push({
              id: id,
              type: 'Property',
              title: split_name[0],
              height: 45
            })

            dictId[split_name[0]] = id
          } 

          roomGroups.push({
            id: id+1000,
            type: "Room",
            title: split_name[1],
            propertyId: dictId[split_name[0]],
            height: 45
          })
          id =  id + 1

          
      })
    }

    setRoomGroups(roomGroups)
    setPropertyGroups(propertyGroups)
  }, []);

  useEffect(() => {
    const newGroups = []
    propertyGroups.map(group => { 
      if (group.type === 'Property') {
        newGroups.push(group)
        if (groupOpened[group.id]) {
          roomGroups.map(room => {
            if (room.propertyId === group.id) {
              newGroups.push(room)
            }
          })
        }
      }
  })
  setGroups(newGroups)
  }, [groupOpened, propertyGroups, roomGroups]);

  return (
    <div className="App">
      <h1>page</h1>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-15, 'day')}
        defaultTimeEnd={moment().add(15, 'day')}
        onCanvasDoubleClick={handleCanvasDoubleClick}
        onItemDoubleClick={handleItemDoubleClick}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        minZoom={604800000}
        groupRenderer={groupRenderer}
        itemRenderer={itemRender}
      >
        <TimelineHeaders>
            <SidebarHeader>
          {({ getRootProps }) => {
            return <div className='sidebarHeader' {...getRootProps()}>Units</div>
          }}
        </SidebarHeader>
        <DateHeader unit='primaryHeader' />
        <DateHeader className='dataheader' />
        </TimelineHeaders>
      <TimelineMarkers>
        <TodayMarker />
        <CursorMarker />
      </TimelineMarkers>
      </Timeline>


      <MoveDialog open={moveOpen} closeDialog={closeMove}/>
      <DetailDialog open={detailOpen} closeDialog={closeDetail}/>

      
    </div>
  );
}

export default App;
