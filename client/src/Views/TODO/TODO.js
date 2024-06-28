import { useEffect, useState } from 'react'
import Styles from './TODO.module.css'
import { dummy } from './dummy'
import axios from 'axios';

export function TODO(props) {

    const [newTodo, setNewTodo] = useState('')
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo()
            setTodoData(apiData);
            setLoading(false)
        }
        fetchTodo();
    }, [])

    const getTodo = async () => {
        const options = {
            method: "GET",
            url: "http://localhost:8000/api/todo",
            headers: {
                accept: "application/json",
            }
        }
        try {
            const response = await axios.request(options)
            return response.data
        } catch (err) {
            console.log(err);
            return []; // return an empty array in case of error
        }
    }

    const addTodo = () => {
        const options = {
            method: "POST",
            url: "http://localhost:8000/api/todo",
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTodo
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => [...prevData, response.data.newTodo])
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const deleteTodo = (id) => {
        const options = {
            method: "DELETE",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => prevData.filter(todo => todo._id !== id))
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const updateTodo = (id) => {
        const todoToUpdate = todoData.find(todo => todo._id === id)
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                ...todoToUpdate,
                done: !todoToUpdate.done
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo))
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const editTodo = (id, title, description) => {
        setEditId(id);
        setEditTitle(title);
        setEditDescription(description);
    };

    const saveTodo = (id) => {
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: editTitle,
                description: editDescription
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo))
                setEditId(null);
                setEditTitle('');
                setEditDescription('');
            })
            .catch((err) => {
                console.log(err)
            })
    };

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>
                    Tasks
                </h1>
    
                <span>
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Todo'
                        value={newTodo}
                        onChange={(event) => {
                            setNewTodo(event.target.value)
                        }}
                    />
                    <button
                        id='addButton'
                        name='add'
                        className={Styles.addButton}
                        onClick={() => {
                            addTodo()
                            setNewTodo('')
                        }}
                    >
                        + New Todo
                    </button>
                </span>
            </div>
            <div id='todoContainer' className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : (
                    todoData.length > 0 ? (
                        todoData.map((entry, index) => (
                            <div key={entry._id} className={Styles.todo}>
                                {editId === entry._id ? (
                                    <div className={Styles.editContainer}>
                                        <input
                                            type='checkbox'
                                            checked={entry.done}
                                            onChange={() => {
                                                updateTodo(entry._id);
                                            }}
                                        />
                                        <input
                                            className={Styles.editInput}
                                            type='text'
                                            value={editTitle}
                                            placeholder='Title'
                                            onChange={(event) => {
                                                setEditTitle(event.target.value)
                                            }}
                                        />
                                        <input
                                            type='text'
                                            className={Styles.editDesc}
                                            value={editDescription}
                                            placeholder='Description'
                                            onChange={(event) => {
                                                setEditDescription(event.target.value)
                                            }}
                                        />
                                        <button
                                            className={Styles.saveButton}
                                            onClick={() => {
                                                saveTodo(entry._id);
                                            }}
                                        >
                                            Save
                                        </button>
                                        <span
                                            className={Styles.editButton}
                                            onClick={() => {
                                                editTodo(entry._id, entry.title, entry.description);
                                            }}
                                        >
                                            Edit
                                        </span>
                                        <span
                                            className={Styles.deleteButton}
                                            onClick={() => {
                                                deleteTodo(entry._id);
                                            }}
                                        >
                                            Delete
                                        </span>
                                    </div>
                                ) : (
                                    <div className={Styles.viewContainer}>
                                        <span className={Styles.infoContainer}>
                                            <input
                                                type='checkbox'
                                                checked={entry.done}
                                                onChange={() => {
                                                    updateTodo(entry._id);
                                                }}
                                            />
                                            {entry.title} - {entry.description}
                                        </span>
                                        <span
                                            className={Styles.editButton}
                                            onClick={() => {
                                                editTodo(entry._id, entry.title, entry.description);
                                            }}
                                        >
                                            Edit
                                        </span>
                                        <span
                                            className={Styles.deleteButton}
                                            onClick={() => {
                                                deleteTodo(entry._id);
                                            }}
                                        >
                                            Delete
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={Styles.noTodoMessage}>
                            <p>No tasks available. Please add a new task.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
