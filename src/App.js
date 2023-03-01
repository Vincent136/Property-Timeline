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
import HoldDialog from './HoldDialog';

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
  const [items, setItems] = useState([]);
  const [roomGroups, setRoomGroups] = useState([]);
  const [propertyGroups, setPropertyGroups] = useState([]);
  const [groups, setGroups] = useState([]);
  const [clickedItems, setClickedItems] = useState({});
  const [groupOpened, setGroupOpened] = useState({});

  const [detailOpen, setDetailOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);

  const handleCanvasClick = (groupId, time) => {
    setHoldOpen(true);

    console.log('Canvas double clicked', groupId, moment(time).format())
  }

  const handleItemDoubleClick = (itemId, _, time) => {
    setClickedItems(items.filter(item => item.id === itemId)[0])

    console.log('Double Click: ' + itemId, moment(time).format())
  }

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
   
    function moveItem(item) {
      var diff = (item.check_out_date - item.check_in_date)

      const startTime = moment(dragTime)
      startTime.set({h: 12, m: 0, s: 0, ms: 0})

      const endTime = moment(dragTime + diff)
      endTime.set({h: 12, m: 0, s: 0, ms: 0})

      item.group = groups[newGroupOrder].id
      item.check_in_date =  startTime
      item.check_out_date = endTime
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
      console.log(item.check_in_date.toDate())
      // console.log(newTime.toDate())
      if ( edge === 'left') {
        time = moment(time)
        time.set({h: 14, m: 0, s: 0, ms: 0})
        const monthTime = moment(time).format('MMM')
        const dayTime = moment(time).format('DD')
        const itemStartDate = item.check_in_date.format('DD')
        const itemStartMonth = item.check_in_date.toDate('MMM')

        if ((itemStartDate !== monthTime) && (itemStartMonth !== dayTime)) item.check_in_date = time;
      }else {
        time = moment(time)
        time.set({h: 12, m: 0, s: 0, ms: 0})

        const monthTime = moment(time).format('MMM')
        const dayTime = moment(time).format('DD')
        const itemEndDate = item.check_out_date.format('DD')
        const itemEndMonth = item.check_out_date.toDate('MMM')
        if ((itemEndDate !== monthTime) && (itemEndMonth !== dayTime)) item.check_out_date = time;
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
    setClickedItems({});
  }

  const openMove = () => {
    setMoveOpen(true);
  };


  const closeMove = () => {
    setMoveOpen(false);
  };

  const openHold = () => {
    setHoldOpen(true);
  }

  const closeHold = () => {
    setHoldOpen(false);
  }

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
    const item = []

    let dictPropertyId = {

    }
    let id = 1

    for (const key in apiGroups.data)
    {
      apiGroups.data[key].forEach(unit => {
          const split_name = unit.unit_name.split("-")
          if (!dictPropertyId[split_name[0]]) {
            propertyGroups.push({
              id: id,
              type: 'Property',
              title: split_name[0],
              height: 45
            })

            dictPropertyId[split_name[0]] = 
            {
              id : id,
              lastId: id,
              room : {

              }
            }
          } 

          if (dictPropertyId[split_name[0]] && !dictPropertyId[split_name[0]].room[split_name[1]]) {
            dictPropertyId[split_name[0]].lastId += 1
            roomGroups.push({
              id: dictPropertyId[split_name[0]].lastId,
              type: "Room",
              title: split_name[1],
              propertyId: dictPropertyId[split_name[0]].id,
              height: 45
            })

            dictPropertyId[split_name[0]].room[split_name[1]] = dictPropertyId[split_name[0]].lastId
          }
          id =  id + 50
          
          const pushUnit = unit
          pushUnit.group = dictPropertyId[split_name[0]].room[split_name[1]]
          pushUnit.check_in_date = moment(unit.check_in_date)
          pushUnit.check_out_date = moment(unit.check_out_date)
          item.push(
            pushUnit
          )
      })
    }

    setItems(item)
    setRoomGroups(roomGroups)
    setPropertyGroups(propertyGroups)
  }, []);

  useEffect(()=> {
    if (JSON.stringify(clickedItems) !== '{}') {
      openDetail();
    }
  }, [clickedItems])

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

  const key = {
    groupIdKey: 'id',
    groupTitleKey: 'title',
    groupRightTitleKey: 'rightTitle',
    itemIdKey: 'id',
    itemTitleKey: 'guest_name',    
    itemDivTitleKey: 'guest_name', 
    itemGroupKey: 'group',
    itemTimeStartKey: 'check_in_date',
    itemTimeEndKey: 'check_out_date',
  }

  return (
    <div className="App">
      <h1>page</h1>
      {items &&
      <Timeline
      groups={groups}
      items={items}
      keys={key}
      sidebarWidth="250"
      // rightSidebarWidth="0"
      defaultTimeStart={moment().add(-15, 'day')}
      defaultTimeEnd={moment().add(15, 'day')}
      onCanvasClick={handleCanvasClick}
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

      }

      <MoveDialog open={moveOpen} closeDialog={closeMove}/>
      <DetailDialog open={detailOpen} closeDialog={closeDetail} items={clickedItems}/>
      <HoldDialog open={holdOpen} closeDialog={closeHold}/>
    </div>
  );
}

export default App;
