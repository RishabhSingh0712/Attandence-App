import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function Home() {
    const [currTime, setCurrTime] = useState(new Date().toLocaleTimeString());
    const [currDate, setCurrDate] = useState(new Date().toLocaleDateString());
    const [currentLocation, setCurrentLocation] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrTime(new Date().toLocaleTimeString());
            setCurrDate(new Date().toLocaleDateString());
        }, 1000);
      
        setIsLoggedIn(true);

        return () => clearInterval(intervalId);
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };
    const handleButtonClick = async (action) => {
        if (!isLoggedIn) {
            console.log('User is not logged in. Please log in to perform this action.');
            return;
        }

        getLocation();
        
        if (currentLocation) {
            try {
              
              const response = await axios.post('http://127.0.0.1:5000/api/user/Attendance', {
                _id: '_id', 
                email: 'user_email',
                
                action,
                
                attendanceDetails: {
                  checkInTime: new Date(),
                  checkInOut: new Date(),
                  location: currentLocation,
                },
              });
      
              console.log(response.data.message);
              window.alert(`Employee ${action}.`);
            } catch (error) {
              window.alert('Error submitting attendance. Please try again.');
            }
          } else {
            window.alert('Error getting location. Please try again.');
          }
        };
    return (
        <div className="mx-auto w-full max-w-7xl">
            <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2"></aside>

            <div className="grid place-items-center sm:mt-20">
                <img className="sm:w-96 w-48" src="https://i.ibb.co/2M7rtLk/Remote1.png" alt="image2" />
            </div>
            <div className='mt-10 text-3xl space-y-4 '>
                <h1 className='hover:text-orange-600'><b>Current Date is =</b> {currDate}</h1>
                <h1 className='hover:text-orange-600'><b>Current Time is = </b>{currTime}</h1>
            </div>
            <div className="space-x-10 mt-10  ">
                <button
                    type="button"
                    onClick={() => handleButtonClick('Office In')}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                    Office In
                </button>
                
                <button
                    type="button"
                    onClick={() => handleButtonClick('Half Day')}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                    Half Day
                </button>
                <button
                    type="button"
                    onClick={() => handleButtonClick('Work From Home')}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                    Work From Home
                </button>
                <button
                    type="button"
                    onClick={() => handleButtonClick('Office Out')}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                    Office Out
                </button>
            </div>
        </div>
    );
}
