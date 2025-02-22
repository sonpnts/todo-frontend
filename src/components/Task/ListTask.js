import React, { useState, useEffect, useRef, useCallback } from 'react';
import APIs from '../../configs/APIs';
import { Container, Form, Button, Spinner, Table, Modal } from 'react-bootstrap';

import debounce from 'lodash.debounce';
import { isCloseToBottom } from "../../Utils/Tobottom";
import TaskItem from "./Task";

const ListTask = () => {
    const [q, setQ] = useState('');
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const scrollContainerRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    const loadTasks = useCallback(async () => {
        console.log("Page", page);
        try {
            setLoading(true);
            let res = await APIs.get(`tasks?page=${page}`);
            console.log(res);
            if (res.data.nextPage ==null) {
                setPage(0);
            }
            if (page==0){

            }else if (page === 1) {
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
            try {
                setLoading(true);
                let res = await APIs.get(`tasks?q=${query}`);
                if (res.data.tasks.length === 0) {
                    setTasks([]);
                } else {
                    setTasks(res.data.tasks);
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
    }, [page]);

    const loadMore = () => {
        if (!loading && page > 0 && scrollContainerRef.current) {
            if (isCloseToBottom(scrollContainerRef.current)) {
                setLoading(true); // Hiển thị spinner trước khi load
                setTimeout(() => {
                    setPage(page +1);
                }, 500); // Thêm delay nhỏ để hiển thị loading trước
            }
        }
    };


    const handleTextChange = (event) => {
        setQ(event.target.value);
    };

    const handleDeleteTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
    };

    const handleInsertSampleData = async () => {
        setShowModal(false);
        const sampleTasks = [
            { title: "Learn Go", description: "Study Golang basics" },
            { title: "Learn React", description: "Practice React hooks" },
            { title: "Build API", description: "Create REST API with Node.js" }
        ];

        try {
            const promises = sampleTasks.map(task => APIs.post(`tasks`, task));
            await Promise.all(promises);
            loadTasks();
        } catch (error) {
            console.error("Lỗi khi thêm dữ liệu mẫu:", error);
        }
    };

    return (
        <div className="app-container">
            <div className="background-image">
                <div className="background-overlay"></div>
                <Container
                    onScroll={loadMore}
                    ref={scrollContainerRef}
                    className="content-container"
                    style={{height: "80vh", overflowY: "auto"}} // Thêm thanh cuộn
                >
                    <header className="menu d-flex align-items-center ">
                        <Form className="search-form d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Nhập từ khóa..."
                                onChange={handleTextChange}
                                value={q}
                                className="search-input me-2"
                            />
                            <Button onClick={() => handleSearch(q)} className="search-button">
                                Tìm kiếm
                            </Button>
                            <button className="btn-primary" onClick={handleInsertSampleData}>Thêm dữ liệu</button>

                        </Form>
                    </header>
                    <Table bordered hover responsive className="table-striped table-sm shadow-sm rounded mt-2">
                        <thead className="thead-light">
                        <tr>
                            {tasks.length > 0 &&
                                Object.keys(tasks[0]).map((key, index) => (
                                    <th key={index} className="text-center">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </th>
                                ))
                            }
                            {tasks.length > 0 &&
                                <th className="text-center">Thao tác</th>
                            }
                        </tr>
                        </thead>
                        <tbody className="text-center">
                        {tasks.map((task) => (
                            <TaskItem key={task.id} task={task} onDelete={handleDeleteTask}/>
                        ))}
                        </tbody>
                    </Table>

                    {loading && (
                        <div className="loading-spinner text-center z-100">
                            <Spinner animation="border" variant="primary"/>
                        </div>
                    )}
                </Container>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Không có dữ liệu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Hệ thống không tìm thấy dữ liệu. Bạn có muốn nhập dữ liệu mẫu không?
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button variant="primary" onClick={handleInsertSampleData}>Thêm dữ liệu mẫu</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ListTask;
