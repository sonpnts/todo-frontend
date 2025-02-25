import React, { useState, useEffect, useRef, useCallback } from 'react';
import APIs from '../../configs/APIs';
import { Container, Form, Button, Spinner, Table, Modal } from 'react-bootstrap';

import debounce from 'lodash.debounce';
import { isCloseToBottom } from "../../Utils/Tobottom";
import TaskItem from "./Task";
import '../../Styles/ListTask.css'

const ListTask = () => {
    const [q, setQ] = useState('');
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const scrollContainerRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '' });


    const loadTasks = useCallback(async () => {
        console.log("Page", page);
        if (isSearching) return;
        try {
            setLoading(true);
            let res = await APIs.get(`tasks?page=${page}`);
            console.log(res);
            if (res.data.nextPage ==null) {
                setPage(0);
            }
            if (page === 1) {
                setTasks(res.data.tasks);
            } else {
                setTasks(current => [...current, ...res.data.tasks]);
            }

        } catch (ex) {
            console.log("Lỗi", ex);
        } finally {
            setLoading(false);
        }
    }, [page]);

    const handleSearch = useCallback(
        debounce(async (query) => {
            setPage(1);
            setIsSearching(true);
            try {
                if(query!==""){
                    setLoading(true);
                    let res = await APIs.get(`tasks?q=${query}`);
                    if (res.data.tasks.length === 0) {
                        setTasks([]);
                    } else {
                        setTasks(res.data.tasks);
                    }
                }
                else{
                    loadTasks();
                    setIsSearching(false)
                }
            } catch (ex) {
                console.log("Lỗi", ex);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        loadTasks();
    }, [loadTasks,page]);

    const loadMore = () => {
        if (isSearching || loading || page === 0 || !scrollContainerRef.current) return;

        if (isCloseToBottom(scrollContainerRef.current)) {
            setLoading(true);
            setTimeout(() => {
                setPage(page + 1);
            }, 500);
        }
    };


    const handleTextChange = (event) => {
        setQ(event.target.value);
    };

    const handleDeleteTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
    };

    const handleInsertSampleData = async () => {
        setIsGlobalLoading(true);
        setShowModal(false);
        const sampleTasks = [
            { "title": "Learn Go", "description": "Study Golang basics" },
            { "title": "Learn React", "description": "Practice React hooks" },
            { "title": "Build API", "description": "Create REST API with Node.js" },
            { "title": "Master TypeScript", "description": "Understand TypeScript and its benefits" },
            { "title": "Explore Next.js", "description": "Learn about server-side rendering with Next.js" },
            { "title": "Database Optimization", "description": "Improve SQL queries and database indexing" },
            { "title": "Build a Chat App", "description": "Develop a real-time chat application using WebSockets" },
            { "title": "Deploy with Docker", "description": "Containerize applications with Docker" },
            { "title": "GraphQL API", "description": "Create a GraphQL API with Apollo Server" },
            { "title": "Authentication System", "description": "Implement JWT-based authentication in a web app" },
            { "title": "CI/CD Pipeline", "description": "Automate deployments with GitHub Actions" },
            { "title": "Microservices Architecture", "description": "Design scalable microservices with Kubernetes" },
            { "title": "AI Chatbot", "description": "Build an AI-powered chatbot using Python and NLP" }
        ];

        try {

            const responses = await Promise.all(sampleTasks.map(task => APIs.post(`tasks`, task)));

            const allSuccessful = responses.every(response => response.status === 200);

            if (allSuccessful) {
                setPage(1);
                scrollContainerRef.current.scrollTo(0, 0);
                loadTasks();
            }

        } catch (error) {
            console.error("Lỗi khi thêm dữ liệu mẫu:", error);

        }
        finally {
            setShowConfirmModal(false);
            setIsGlobalLoading(false);
            setShowAddModal(false);
        }
    };
    const handleAddTask = async () => {
        try {
            setIsGlobalLoading(true);
            let res = await APIs.post('tasks', newTask);
            if (res.status === 200) {
                setNewTask('');
                setShowAddModal(false);
                setPage(1);
                loadTasks();
            }
        } catch (ex) {
            console.log("Lỗi", ex);
        } finally {
            setIsGlobalLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="menu">
                <div><h4 className="mb-0 text-primary title-web">Quản lý Công việc</h4></div>
                <div className="search-form">
                    <div className="d-flex group-search">
                        <input
                            type="text"
                            placeholder="Nhập từ khóa..."
                            onChange={handleTextChange}
                            value={q}
                            className="search-input"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSearch(q);
                                }
                            }}
                        />
                        <button onClick={() => handleSearch(q)} className="search-button">
                            <i className="bi bi-search"></i> Tìm kiếm
                        </button>
                    </div>


                </div>
                <button onClick={() => setShowAddModal(true)} className="add-data-button">
                    <i className="bi bi-plus-circle"></i> Thêm nhiệm vụ
                </button>
            </div>

            <Container
                className="content-container"
            >
                <div className="table-content" ref={scrollContainerRef}
                     onScroll={loadMore}>
                    {tasks.length > 0 ? (
                        <Table bordered hover responsive className="table-striped table-sm shadow-sm rounded">
                            <thead className="thead-light">
                            <tr>
                                {Object.entries(tasks[0]).map(([key], index) => (
                                    <th key={index} className="text-center">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </th>
                                ))}
                                <th className="text-center">Action</th>
                            </tr>
                            </thead>
                            <tbody className="text-center">
                            {tasks.map((task) => (
                                <TaskItem key={task.id} task={task} onDelete={handleDeleteTask}/>
                            ))}
                            </tbody>
                        </Table>

                    ) : (
                        <p className="text-center mt-3 text-muted">Không có dữ liệu công việc.</p>
                    )}

                    {loading && (
                        <div className="loading-spinner text-center">
                            <Spinner animation="border" variant="primary"/>
                        </div>
                    )}
                    </div>
            </Container>


            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập dữ liệu mẫu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Hệ thống không tìm thấy dữ liệu. Bạn có muốn nhập dữ liệu mẫu không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleInsertSampleData}>Thêm dữ liệu mẫu</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có muốn nhập dữ liệu mẫu không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleInsertSampleData}>Thêm dữ liệu mẫu</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Thêm nhiệm vụ</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Tiêu đề</Form.Label>
                            <Form.Control type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control as="textarea" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={()=> setShowConfirmModal(true)}  >Thêm dữ liệu mẫu</Button>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleAddTask}>Thêm</Button>
                </Modal.Footer>
            </Modal>

            {isGlobalLoading && (
                <div className="global-loading-overlay">
                    <div className="spinner-container">
                        <Spinner animation="border" variant="light" />
                        <p className="loading-text">Đang xử lý, vui lòng chờ...</p>
                    </div>
                </div>
            )}


        </div>
    );

};

export default ListTask;
