import { useParams } from "react-router-dom";
import { Col, Container, Row, Modal, Card, Button, Form, Table } from "react-bootstrap";
import React, { useState, useEffect, useRef } from 'react';
import * as createjs from '@createjs/easeljs';
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function TaskPage() {
    const { id } = useParams();
    const [task, setTask] = useState(null); // Veri durumu
    const [loading, setLoading] = useState(true); // Yükleniyor durumu
    const [error, setError] = useState(null);
    const [editedTask, setEditedTask] = useState({}); // Düzenlenmiş task
    const [showModal, setShowModal] = useState(false);
    const canvasRef = useRef(null);
    
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    useEffect(() => {
        const canvas = canvasRef.current;
    
        if (!canvas) return; // canvas null ise işlem yapma
    
        const stage = new createjs.Stage(canvas);
    
        const taskDetail = { name: task.title, x: canvas.width / 2, y: 200 };

        let userCount = task?.userActivities?.$values?.length;
        const users = [];
        let lastXPos = 0;
    
        for (let index = 0; index < userCount; index++) {
            let xPos = (index === 0) ? (canvas.width / userCount) / 2 : lastXPos + (canvas.width / userCount);
            users.push({ name: task?.userActivities?.$values[index].user.username + index, x: xPos, y: 400 });
            lastXPos = xPos;
        }
    
        const taskLabel = new createjs.Text(taskDetail.name, "20px Arial Black", "#000");
        taskLabel.x = taskDetail.x - taskLabel.getMeasuredWidth() / 2;
        taskLabel.y = taskDetail.y - 40;
    
        const taskLine = new createjs.Shape();
        taskLine.graphics.beginStroke("black").setStrokeStyle(2).moveTo(taskDetail.x, taskDetail.y).lineTo(taskDetail.x, taskDetail.y + 50);
    
        users.forEach(user => {
            const userLabel = new createjs.Text(user.name, "14px Arial", "#000");
            userLabel.x = user.x - userLabel.getMeasuredWidth() / 2;
            userLabel.y = user.y + 10;
    
            const userLine = new createjs.Shape();
            userLine.graphics.beginStroke("black").setStrokeStyle(2).moveTo(taskDetail.x, taskDetail.y + 50).lineTo(user.x, user.y);
    
            stage.addChild(userLine, userLabel);
        });
    
        stage.addChild(taskLabel, taskLine);
        stage.update();
    
        createjs.Ticker.fps = 1;
        createjs.Ticker.addEventListener("tick", stage);
    
        return () => {
            createjs.Ticker.removeEventListener("tick", stage);
        };
    }, [canvasRef, task]);  
    
    const fetchTaskData = async () => {
        try {
            const response = await axios.get(
            `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_TASK_DETAIL_PATH}/${id}`,
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }
            );
            setTask(response.data);
            setEditedTask(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {    
        fetchTaskData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!task) {
        return <div>No task data found</div>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask({ ...editedTask, [name]: value });
    };

    const handleSaveChanges = async () => {
        const response = await axios.put(process.env.REACT_APP_API_URL + process.env.REACT_APP_API_TASK_UPDATE_PATH,
            JSON.stringify({
                id: id,
                title: editedTask.title,
                description: editedTask.description,
                dueDate: editedTask.dueDate,
                isCompleted: (editedTask.isCompleted === "true" ? true : false)
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            }
        );

        setTask(editedTask);
        setShowModal(false);
        setLoading(false);
    };

    const completeAssignment = async () => {
        await axios.put(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_TASK_UPDATE_STATUS_PATH}/${decodedToken.sub.toString()}/${id}?isCompleted=true`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        fetchTaskData();
    }

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <Container fluid className="p-0">
            <Row fluid>
                <Col>
                    <Card className="bg-indigo-100 rounded-lg shadow-md p-6 mb-10">
                        <Card.Body>
                            <Card.Title className="text-2xl font-bold text-indigo-800">{task.title}</Card.Title>
                            <Card.Text className="text-gray-700 mt-4">{task.description}</Card.Text>

                            <Row className="mt-6">
                            <Col md={6} className="mb-4">
                                <Card className="p-4 bg-white rounded-lg shadow-sm border">
                                <Card.Body>
                                    <Card.Title className="text-lg font-semibold text-indigo-600">Task Number:</Card.Title>
                                    <Card.Text className="text-gray-800">{task.id}</Card.Text>
                                </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} className="mb-4">
                                <Card className="p-4 bg-white rounded-lg shadow-sm border">
                                <Card.Body>
                                    <Card.Title className="text-lg font-semibold text-indigo-600">Created By:</Card.Title>
                                    <Card.Text className="text-gray-800">{task.createdUser.username} [{task.createdUser.email}]</Card.Text>
                                </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} className="mb-4">
                                <Card className="p-4 bg-white rounded-lg shadow-sm border">
                                <Card.Body>
                                    <Card.Title className="text-lg font-semibold text-indigo-600">Deadline:</Card.Title>
                                    <Card.Text className="text-gray-800">{
                                        new Date(task.dueDate).toLocaleString('tr-TR', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Card.Text>
                                </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} className="mb-4">
                                <Card className="p-4 bg-white rounded-lg shadow-sm border">
                                <Card.Body>
                                    <Card.Title className="text-lg font-semibold text-indigo-600">Status:</Card.Title>
                                    <Card.Text className={`font-bold ${task.isCompleted ? "text-green-500" : "text-red-500"}`}>
                                        {task.isCompleted ? "Completed" : "Not Completed"}
                                    </Card.Text>
                                </Card.Body>
                                </Card>
                            </Col>
                            </Row>

                            <div className="mt-8 d-flex gap-4">
                                <Button variant="primary" onClick={handleShow}>Edit Task</Button>
                                <Button variant="danger">Delete Task</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="bg-indigo-100 rounded-lg shadow-md p-6 mb-10">
                        <Card.Body>
                            <Card.Title className="text-2xl font-bold text-indigo-800">Assigned Users</Card.Title>
                            <div className="text-gray-700 mt-4">
                                <Table striped bordered>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Username</th>
                                            <th>Assign Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {task.userActivities.$values.map((userActivity, index) => (
                                        <tr key={userActivity.id}>
                                            <td>{index + 1}</td>
                                            <td>{userActivity.user.username}</td>
                                            <td>{
                                                new Date(userActivity.createdDate).toLocaleString('tr-TR', {
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td>
                                                {userActivity.isCompleted ? <span className="text-xs text-green-600 font-semibold">COMPLETED</span> : <span className="text-xs text-red-600 font-semibold">NOT COMPLETED</span>}
                                                {userActivity.user.username === decodedToken.unique_name && !userActivity.isCompleted ? <a href='#' className="float-end bg-green-500 p-1 rounded-md text-white text-xs" onClick={completeAssignment}>COMPLETE</a> : ''}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="bg-indigo-100 rounded-lg shadow-md p-6 d-flex flex-column align-items-center justify-content-center">
                        <Card.Body>
                            <h1 className="text-2xl font-bold text-indigo-800 mb-3">Task Graph</h1>
                            <canvas ref={canvasRef} width="800" height="600" style={{ border: '1px solid #ccc', backgroundColor: '#f5f5f5', borderRadius: 10 }} />
                        </Card.Body>
                    </Card>

                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                            <Form.Group className="mb-3" controlId="taskTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                type="text"
                                value={editedTask.title}
                                name="title"
                                onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="taskDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                as="textarea"
                                rows={3}
                                value={editedTask.description}
                                name="description"
                                onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="taskDueDate">
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control
                                type="datetime-local"
                                value={editedTask.dueDate}
                                name="dueDate"
                                onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="taskIsCompleted">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={editedTask.isCompleted}
                                    name="isCompleted"
                                    onChange={handleInputChange}
                                >
                                    <option value="true">Completed</option>
                                    <option value="false">Not completed</option>
                                </Form.Select>
                            </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    )
}

export default TaskPage;
