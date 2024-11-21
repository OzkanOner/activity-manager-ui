import { Col, Container, Row, Modal, Card, Button, Form, Table } from "react-bootstrap";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

function HomePage() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: ''
    });

    useEffect(() => {    
        fetchAllTasks();
    }, []);

    const fetchAllTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_TASK_LIST_PATH}`,
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        setLoading(true);

        if (!newTask.dueDate || isNaN(new Date(newTask.dueDate).getTime())) {
            alert("Geçerli bir tarih giriniz.");
            setLoading(false);
            return;
        }

        const formattedDueDate = new Date(newTask.dueDate).toISOString();

        try {
            await axios.post(process.env.REACT_APP_API_URL + process.env.REACT_APP_API_TASK_CREATE_PATH,
                JSON.stringify({
                    title: newTask.title,
                    description: newTask.description,
                    dueDate: formattedDueDate,
                    createdUserId: decodedToken.sub
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            fetchAllTasks();
            setNewTask({ title: '', description: '', dueDate: '' });
            setShowModal(false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error saving task:', error);
        }
    };

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <>
            <Container fluid="fluid" className="p-0">
                <Row fluid="fluid">
                    <Col>
                        <Card className="bg-slate-100 rounded-lg shadow-md mb-10">
                            <Card.Header className="relative">
                                <Card.Title className="text-2xl mb-0 font-bold text-indigo-800">All Activities</Card.Title>
                                <Button variant="primary" size="sm" onClick={handleShow} className="absolute right-5 top-2">Create New Activity</Button>
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
                                        {tasks?.sort((a, b) => {return b.id - a.id})?.map((task, index) => (
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
                                                </td>
                                                <td><span className={`font-bold ${task.isCompleted ? "text-green-500" : "text-red-500"}`}>{(task.isCompleted ? "Completed" : "Not completed")}</span></td>
                                                <td width="10">
                                                    <a className="font-semibold text-xs text-white bg-indigo-500 px-2 py-1 rounded-md hover:bg-indigo-700 transition" href={`/task/${task.id}`}>DETAILS&nbsp;&gt;</a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Activity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="taskTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newTask.title || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="taskDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={newTask.description || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="taskDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="dueDate"
                                value={newTask.dueDate || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSaveChanges}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default HomePage;