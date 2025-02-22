import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import APIs from "../../configs/APIs";

const TaskItem = ({ task, onDelete }) => {
    const [completed, setCompleted] = useState(task.completed);
    const [showConfirm, setShowConfirm] = useState(false); // Trạng thái hiển thị modal xác nhận

    const handleCheck = async () => {
        if (completed) return;

        try {
            setCompleted(true);
            await APIs.put(`/tasks/${task.id}`, { completed: true });
        } catch (error) {
            console.error("Lỗi khi cập nhật task:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await APIs.delete(`/tasks/${task.id}`);
            setShowConfirm(false);
            onDelete(task.id);
        } catch (error) {
            console.error("Lỗi khi xóa task:", error);
        }
    };

    return (
        <>
            <tr style={{ height: '50px' }}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td className="text-center">
                    <Form.Check
                        type="checkbox"
                        checked={completed}
                        onChange={handleCheck}
                        disabled={completed}
                    />
                </td>
                <td className="text-center">
                    <Button variant="danger" size="sm" onClick={() => setShowConfirm(true)}>
                        Xóa
                    </Button>
                </td>
            </tr>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa task này?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Xác nhận xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TaskItem;
