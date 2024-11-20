import { useRef, useState, useEffect } from "react";
import axios from "axios";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';

const USER_REGEX = /^[a-zA-Z0-9_]{3,15}$/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function RegisterPage() {
    const userRef = useRef();
    const emailRef = useRef();

    const [show, setShow] = useState(false);

    const [validated, setValidated] = useState(false);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, email, pwd, matchPwd])
    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        setValidated(true);

        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = EMAIL_REGEX.test(email);
        const v3 = PWD_REGEX.test(pwd);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + process.env.REACT_APP_API_REGISTER_PATH,
                JSON.stringify({ username: user, password: pwd, email: email }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg(err.response?.data);
            } else {
                setErrMsg('Registration Failed');
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
                            Registration Successful!
                        </h1>
                        <p className="text-gray-700 mb-6">
                            You can now log in to your account!
                        </p>
                        <a
                            href="/login"
                            className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Sign In
                        </a>
                    </div>
                </section>            
            ) : (
                <Container fluid className="min-h-screen flex items-center justify-center bg-gray-100">
                    <Row className="w-100 justify-content-center">
                        <Col xs={12} sm={10} md={8} lg={6} xl={5} className="bg-white p-6 rounded-lg shadow-lg max-w-xl">
                            <h1 className="text-3xl py-10 font-bold uppercase text-center mb-6 text-indigo-600">Register</h1>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                                        isInvalid={user && !validName}
                                        isValid={validName}
                                        aria-invalid={validName ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={() => setUserFocus(true)}
                                        onBlur={() => setUserFocus(false)}
                                        className="text-lg text-gray-600 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter 3 to 15 characters, only letters, numbers and underscores
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label htmlFor="email" className="font-medium text-gray-700 flex justify-between items-center">
                                        Email
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="email"
                                        ref={emailRef}
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                        isInvalid={email && !validEmail}
                                        isValid={validEmail}
                                        aria-invalid={validEmail ? "false" : "true"}
                                        aria-describedby="emailnote"
                                        onFocus={() => setEmailFocus(true)}
                                        onBlur={() => setEmailFocus(false)}
                                        className="text-lg text-gray-600 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid email address
                                    </Form.Control.Feedback>
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
                                        isInvalid={pwd && !validPwd}
                                        isValid={validPwd}
                                        aria-invalid={validPwd ? "false" : "true"}
                                        aria-describedby="pwdnote"
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                        className="text-lg text-gray-600 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter minimum 8 characters, must contain at least one uppercase letter, one lowercase letter, one number, and one special character
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label htmlFor="confirm_pwd" className="font-medium text-gray-700 flex justify-between items-center">
                                        Confirm Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        id="confirm_pwd"
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                        value={matchPwd}
                                        required
                                        isInvalid={!validMatch}
                                        isValid={validMatch && matchPwd && validPwd}
                                        aria-invalid={validMatch ? "false" : "true"}
                                        aria-describedby="confirmnote"
                                        onFocus={() => setMatchFocus(true)}
                                        onBlur={() => setMatchFocus(false)}
                                        className="text-lg text-gray-600 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Must match the first password input field.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={!validName || !validPwd || !validMatch ? true : false}
                                    className="text-lg text-white w-full py-3 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Sign Up
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
                                        <strong className="me-auto">Register Failed!</strong>
                                        <small>ERROR</small>
                                    </Toast.Header>
                                    <Toast.Body className="text-white">
                                        {errMsg}
                                    </Toast.Body>
                                </Toast>
                            </Form>
                            <hr className="my-6" />
                            <p className="text-center">
                                Already registered? <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign In</a>
                            </p>
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    )
}

export default RegisterPage