import React from 'react';
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { nanoid } from "nanoid";
import styled from "styled-components";
import Modal from "react-bootstrap/Modal";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Props {
  id: string;
  title: string;
}

const App = () => {
  const [items, setItems] = useState<Props[]>([]);
  const [newItem, setNewItem] = useState<string>("");
  const [changeInput, setChangeInput] = useState<string>("");
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const updatedItems = Array.from(items);
    const [removedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, removedItem);
    setItems(updatedItems);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      const newItemObj = { id: nanoid(), title: newItem };
      setItems([...items, newItemObj]);
      setNewItem("");
    }
  };

  const deleteItem = (id: string) => {
    setItems((items) => {
      return items.filter((item) => item.id !== id)
    })
  }

  const handleShow = (id: string, title: string) => {
    setCurrentItemId(id);
    setChangeInput(title);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleEditItem = () => {
    if (currentItemId) {
      const updatedItems = items.map(item =>
        item.id === currentItemId ? { ...item, title: changeInput } : item
      );
      setItems(updatedItems);
      handleClose();
    }
  };

  const List = styled.ul`
    list-style: none;
    display: flex;
    justify-content: center;
  `;

  const Item = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    border: 1px solid;
    padding: 20px;
    width: 300px;
  `;

  return (
    <Container className="w-100 d-flex flex-column align-items-center">
      <form onSubmit={handleAddItem} className="d-flex mb-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="form-control"
        />
        <Button variant="primary" type="submit" className="ml-2">
          EKLE
        </Button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="myList">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="w-100"
            >
              {items.map(({ id, title }: Props, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <List
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <li>
                        <Item>
                          {title}
                          <Button variant="warning" onClick={() => handleShow(id, title)}>
                            <FaEdit />
                          </Button>
                          <Button variant="danger" onClick={() => deleteItem(id)}>
                            <FaTrash />
                          </Button>
                        </Item>
                      </li>
                    </List>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="d-flex justify-content-center">
          <input
            type="text"
            value={changeInput}
            onChange={(e) => setChangeInput(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditItem}>
            Değiştir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default App;
