import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';

function LoginPage() {
    const userRef = useRef();
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + process.env.REACT_APP_API_LOGIN_PATH,
                JSON.stringify({ username: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            localStorage.setItem("token", response?.data);
            
            setSuccess(true);
            setUser('');
            setPwd('');

            navigate('/home');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 401) {
                setErrMsg("Invalid username or password!");
            } else {
                setErrMsg('Login Failed');
            }
            setShow(true);
        }
    }

    return (
        <>
            {success ? (
                <section className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                        <h1 className="text-2xl font-bold text-indigo-600 mb-4">
                            Login Successful!
                        </h1>
                    </div>
                </section>
            ) : (
                <Container fluid className="min-h-screen flex items-center justify-center bg-gray-100">
                    <Row className="w-100 justify-content-center">
                        <Col xs={12} sm={10} md={8} lg={6} xl={5} className="bg-white p-6 rounded-lg shadow-lg max-w-xl">
                            <h1 className="text-3xl py-10 font-bold uppercase text-center mb-6 text-indigo-600">Sign in</h1>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label htmlFor="username" className="font-medium text-gray-700 flex justify-between items-center">
                                        Username
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        required
                                        aria-describedby="uidnote"
                                        className="text-lg text-gray-600 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label htmlFor="password" className="font-medium text-gray-700 flex justify-between items-center">
                                        Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                        aria-describedby="pwdnote"
                                        className="text-lg text-gray-600 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="text-lg text-white w-full py-3 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Sign In
                                </Button>

                                <Toast
                                    onClose={() => setShow(false)}
                                    show={show}
                                    delay={5000}
                                    autohide
                                    bg="danger"
                                    className="fixed top-3 right-3"
                                >
                                    <Toast.Header>
                                        <strong className="me-auto">Login Failed!</strong>
                                        <small>ERROR</small>
                                    </Toast.Header>
                                    <Toast.Body className="text-white">
                                        {errMsg}
                                    </Toast.Body>
                                </Toast>
                            </Form>
                            <hr className="my-6" />
                            <p className="text-center">
                                Don't have an account? <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Register</a>
                            </p>
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    )
}

export default LoginPage