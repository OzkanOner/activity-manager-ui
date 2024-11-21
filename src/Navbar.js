import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Navbar() {
    /* =====================NOTIFY============================= */

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = window.location.pathname;

  const lastCheckedDate = localStorage.getItem('lastCheckedDate');

  if (!lastCheckedDate) {
    const currentDate = new Date().toISOString();
    localStorage.setItem('lastCheckedDate', currentDate);
  }

  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Bildirim izni verildi');
      }
    });
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
          `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_TASK_LIST_USER_ASSIGNED_PATH}/${decodedToken.sub}`,
          {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          }
      );

      const tasks = response?.data?.$values;
      setTasks(tasks);

      const newTasks = tasks?.filter(task => {
        return new Date(task.createdDate) > new Date(lastCheckedDate);
      });

      if (newTasks?.length > 0) {
        showNotification(newTasks);
        const currentDate = new Date().toISOString();
        localStorage.setItem('lastCheckedDate', currentDate);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching tasks:', error);
    }
  };

  const showNotification = (newTasks) => {
    newTasks.forEach(task => {
      new Notification(`New Assignment: ${task.title}`, {
        body: `A new task has been assigned: ${task.description}`,
        icon: '/new-task.png',
      });
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      console.log("URL changed:", window.location.pathname);
    };
  
    window.addEventListener('popstate', handlePopState);
  
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 60000);

    return () => clearInterval(interval);
  }, []);  

  /* =====================NOTIFY============================= */


    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Container>
            <Row>
                <Col>
                <nav className="bg-indigo-950 p-4 rounded-md mt-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <a href="/" className="text-white text-2xl font-semibold">
                            Activity Manager
                        </a>

                        <div className="hidden md:flex space-x-6">
                            <a href="/home" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md transition">Home</a>
                            
                            <a href="/tasks/createdbyme" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md transition">
                                Created by Me
                            </a>
                            
                            <a href="/tasks/assignedtome" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md transition">
                                Assigned to Me
                            </a>
                        </div>

                        <button
                            className="text-white md:hidden bg-indigo-700 px-3 py-2 rounded-md transition"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="material-icons">Menu</span>
                        </button>

                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = "/login";
                            }}
                        >
                            Logout
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="fixed inset-0 bg-slate-800 bg-opacity-90 z-50 md:hidden">
                            <div className="absolute top-4 right-4 text-white cursor-pointer" onClick={toggleMenu}>
                                X
                            </div>
                            <div className="flex flex-col justify-center items-center p-6 space-y-4 min-h-screen">
                                <a href="/home" className="text-white text-lg py-2 px-6 rounded-md hover:bg-indigo-700 transition w-full text-center">
                                    Home
                                </a>
                                <a href="/tasks/createdbyme" className="text-white text-lg py-2 px-6 rounded-md hover:bg-indigo-700 transition w-full text-center">
                                    Created by Me
                                </a>
                                <a href="/tasks/assignedtome" className="text-white text-lg py-2 px-6 rounded-md hover:bg-indigo-700 transition w-full text-center">
                                    Assigned to Me
                                </a>
                            </div>
                        </div>
                    )}
                    </nav>
                </Col>
            </Row>
        </Container>
    )
}

export default Navbar