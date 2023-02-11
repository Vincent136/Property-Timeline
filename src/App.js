import { useState, useEffect } from 'react';
import Timeline, {
  TimelineMarkers,
  TimelineHeaders,
  TodayMarker,
  CustomMarker,
  CursorMarker,
  CustomHeader,
  SidebarHeader,
  DateHeader
} from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import Modal from 'react-modal';

import mockitems from './mockitems';
import mockgroups from './mockgroups';

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
  const [groups, setGroups] = useState(mockgroups);
  const [clickedItems, setClickedItems] = useState({});

  const [modalIsOpen, setIsOpen] = useState(false);

  const handleCanvasDoubleClick = (groupId, time) => {
    

    console.log('Canvas double clicked', groupId, moment(time).format())
  }

  const handleItemDoubleClick = (itemId, _, time) => {
    setClickedItems(items.filter(item => item.id === itemId))

    openModal();

    console.log('Double Click: ' + itemId, moment(time).format())
  }

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {

    function moveItem(item) {
      var diff = (item.end_time - item.start_time)

      item.group = newGroupOrder
      item.start_time =  dragTime
      item.end_time = dragTime + diff
    }

    let newitems = [...items]

    newitems.map( 
      item => item.id === itemId
        ? moveItem(item)
        : item
    )
    
    setItems(newitems)
 
    console.log('Moved', itemId, dragTime, newGroupOrder)
  }

  
  const handleItemResize = (itemId, time, edge) => {

    function setSize(item) {
      item.start_time =  edge === 'left' ? time : item.start_time
      item.end_time =  edge === 'left' ? item.end_time : time
    }

    let newitems = [...items]

    newitems.map( 
      item => item.id === itemId
        ? setSize(item)
        : item
    )

    setItems(newitems)

    console.log('Resized', itemId, time, edge)
  }


  const openModal = () => {
    console.log(clickedItems)
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <div className="App">
      <h1>page</h1>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-12, 'hour')}
        defaultTimeEnd={moment().add(12, 'hour')}
        onCanvasDoubleClick={handleCanvasDoubleClick}
        onItemDoubleClick={handleItemDoubleClick}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
      >
      <TimelineMarkers>
        <TodayMarker />
        <CursorMarker />
      </TimelineMarkers>

      <TimelineHeaders style={{background: 'green'}}>
          <SidebarHeader>
            {({ getRootProps }) => {
              return <div {...getRootProps()}>Property Name</div>;
            }}
          </SidebarHeader>
          <DateHeader unit="primaryHeader" />
          <DateHeader
            style={{ height: 50 }}
            intervalRenderer={({ getIntervalProps, intervalContext }) => {
              return (
                <div
                  {...getIntervalProps({
                    style: {}
                  })}
                >
                  {intervalContext.intervalText}
                </div>
              );
            }}
          />
        </TimelineHeaders>
      </Timeline>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>{modalIsOpen ? clickedItems[0].title : ''}</h2>
        <button onClick={closeModal}>close</button>
      </Modal>
    </div>
  );
}

export default App;
