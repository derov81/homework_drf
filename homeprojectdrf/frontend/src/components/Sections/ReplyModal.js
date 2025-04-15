import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ReplyModal = ({ show, onClose, onSend, replyText, setReplyText, setReplyFile }) => {
    return (
        <Modal show={show} onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Ответ клиенту</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="replyMessage">
                    <Form.Label>Сообщение</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Введите ответ..."
                    />
                </Form.Group>
                <Form.Group controlId="replyFile" className="mt-3">
                    <Form.Label>Прикрепить файл (необязательно)</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setReplyFile(e.target.files[0])}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={onSend}>
                    Отправить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReplyModal;
