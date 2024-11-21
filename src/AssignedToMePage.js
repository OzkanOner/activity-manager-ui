import { Col, Container, Row, Modal, Card, Button, Form, Table } from "react-bootstrap";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

function AssignedToMePage() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState(null);

    useEffect(() => {    
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
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
            
            setTasks(response?.data?.$values);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Container fluid="fluid" className="p-0">
                <Row fluid="fluid">
                    <Col>
                        <Card className="bg-slate-100 rounded-lg shadow-md mb-10">
                            <Card.Header>
                                <Card.Title className="text-2xl mb-0 font-bold text-indigo-800">Activities Assigned To Me</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Table striped bordered className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Created Date</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {tasks?.sort((a, b) => b.id - a.id).map((task, index) => {
                                        const today = new Date();
                                        const dueDate = new Date(task.dueDate);
                                        
                                        const isDueToday = today.toDateString() === dueDate.toDateString();

                                        return (
                                            <tr key={task.id}>
                                                <td>{task.id}</td>
                                                <td>{task.title}</td>
                                                <td>
                                                    {new Date(task.createdDate).toLocaleString('tr-TR', {
                                                        year: 'numeric',
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td>
                                                    {new Date(task.dueDate).toLocaleString('tr-TR', {
                                                        year: 'numeric',
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                    {isDueToday && (
                                                        <span className="text-red-500 ml-2 font-semibold">⚠️ Due Today!</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`font-bold ${task.isCompleted ? "text-green-500" : "text-red-500"}`}>
                                                        {task.isCompleted ? "Completed" : "Not completed"}
                                                    </span>
                                                </td>
                                                <td width="10">
                                                    <a className="font-semibold text-xs text-white bg-indigo-500 px-2 py-1 rounded-md hover:bg-indigo-700 transition" href={`/task/${task.id}`}>
                                                        DETAILS&nbsp;&gt;
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AssignedToMePage;