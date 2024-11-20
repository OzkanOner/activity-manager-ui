import { Col, Container, Row } from "react-bootstrap";
import React, { useState } from 'react';

function HomePage() {
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
                        
                        <a href="/tasks/created" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md transition">
                            Created by Me
                        </a>
                        
                        <a href="/tasks/assigned" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md transition">
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
                            <a href="/tasks/created" className="text-white text-lg py-2 px-6 rounded-md hover:bg-indigo-700 transition w-full text-center">
                                Created by Me
                            </a>
                            <a href="/tasks/assigned" className="text-white text-lg py-2 px-6 rounded-md hover:bg-indigo-700 transition w-full text-center">
                                Assigned to Me
                            </a>
                        </div>
                    </div>
                )}
                </nav>
            </Col>
        </Row>
    </Container>
  );
}

export default HomePage;