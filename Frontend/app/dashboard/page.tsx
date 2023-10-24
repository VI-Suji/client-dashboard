"use client"
import PopupBox from '../Components/Popup/page';
import Write from '../write/page';
import './style.css'
import { useEffect, useState} from 'react'

type data = {
    device_ip : string
    type : string
    time :string
}

export default function Dashboard() {
    const [buttonData, setButtonData] = useState<any>([]);
    const [hoveredButtonTime, setHoveredButtonTime] = useState(null);
    const [popupdata,setPopup] = useState({});

    const refreshPage = () => {
       fetch('http://localhost:3001/api/data')
      .then((response) => response.json())
      .then((data) => setButtonData(data))
      .catch((error) => {
          console.log('Redirecting to error page',error);
          window.location.href = '/Components/404';
      });
    }

    useEffect(() => {
        refreshPage();
        const interval = setInterval(refreshPage, 10000); 
        return () => clearInterval(interval);
      }, []);

    const createButtonGrid = () => {
    const rows = [];
    let row = [];
    let c=4

    for (let i = 0; i < buttonData.length; i++) {
        const button = buttonData[i];
        const myData: data = {
            device_ip : button.device_ip,
            type : button.type,
            time : button.time
        }
        row.push(
        <button
            className='button'
            key={button.device_ip}
            style={{ backgroundColor: button.color }}
            onMouseEnter={() => setHoveredButtonTime(button.time)}
            onClick={() => setPopup(myData)}
            onMouseLeave={() => setHoveredButtonTime(null)}
        >
            B
        </button>
        );
        if (row.length === c || i === buttonData.length - 1) {
            rows.push(<div key={i} className='button-row align-middle'>{row}</div>);
            row = [];
            c--;
        }
    }

    return rows;
    };
  
    return (
        <div className="full-screen-container">
        {createButtonGrid()}
        {hoveredButtonTime && (
            <Write message={'Error Date and Time : ' + hoveredButtonTime}/>
        )}
        {popupdata && (
            <PopupBox data={popupdata}/>
        )}
      </div>
    );
}
