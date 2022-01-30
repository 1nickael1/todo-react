import React, {useState, useEffect} from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

import './assets/Global.css';
import IconSun from './assets/images/icon-sun.svg';
import IconMoon from './assets/images/icon-moon.svg';
import IconRemoveTodo from './assets/images/icon-cross.svg'
import IconCheck from './assets/images/icon-check.svg'
import { useStoreTodos } from './Store';

export const App: React.FC = () => {
  const [lightMode, setLightMode] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [listTodos, setListTodos] = useState<listTodosProps[]>([]);
  const [listTodosOriginal, setListTodosOriginal] = useState<listTodosProps[]>([]);
  const [buttonActive, setButtonActive] = useState(1);

  const {todos, modificarTodo} = useStoreTodos();

  useEffect(() => {
    setListTodosOriginal(todos);
    setListTodos(todos);
  }, [])

    interface listTodosProps {
        descript: string;
        completed: boolean;
    }

    function lightAndDarkMode() {
        setLightMode(prevState => !prevState)
    }

    function addTodo(event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key == "Enter") {
            let newList = [...listTodosOriginal, {
                descript: newTodo,
                completed: false
            }]

            setListTodos(newList);
            setListTodosOriginal(newList);
            modificarTodo(newList);
            setNewTodo('')
        }
    }

    function applyDrag(arr: any, dragResult: any) {
        const { removedIndex, addedIndex, payload } = dragResult;

        if (removedIndex === null && addedIndex === null) return arr;
        const result = [...arr];
        let itemToAdd = payload;
        
        if (removedIndex !== null) {
            itemToAdd = result.splice(removedIndex, 1)[0];
        }
        if (addedIndex !== null) {
            result.splice(addedIndex, 0, itemToAdd);
        }
        return result;
    };

    function onDrop(dropResult: any) {
        let newList = applyDrag(listTodos, dropResult);

        setListTodos(newList)
    }

    function listAllTodos() {
        setButtonActive(1);
        setListTodos(listTodosOriginal);
    }

    function listActiveTodos() {
        setButtonActive(2);
        let newList = listTodosOriginal.filter(item => item.completed === false)
        setListTodos(newList);
    }

    function listCompletedTodos() {
        setButtonActive(3);
        let newList = listTodosOriginal.filter(item => item.completed === true)
        setListTodos(newList);
    }

    function checkTodo(index: any) {
        let newList = [...listTodos];
        newList[index].completed = !newList[index].completed;
        setListTodos(newList);
        setListTodosOriginal(newList);
        modificarTodo(newList);
    }

    function clearCompleted() {
        let newList = listTodosOriginal.filter(item => item.completed != true);
        if(!newList) {
            setButtonActive(1);
        }

        setListTodosOriginal(newList);
        setListTodos(newList);
        modificarTodo(newList);
    }

    function removeTodo(indexTodo: any) {
        let newList = listTodosOriginal.filter((item, index) => index != indexTodo);
        setListTodosOriginal(newList);
        setListTodos(newList);
        modificarTodo(newList);
    }

  return (
    <div className={lightMode ? 'light-mode' : ''}>
        <div className="home-container">
            <div className="todo-app">
                <div className="header">
                    <h1>TODO</h1>
                    <img src={lightMode ? IconMoon : IconSun} 
                        onClick={lightAndDarkMode} 
                        style={{cursor: 'pointer'}}
                    />
                </div>
                <div className="create-todo">
                    <input 
                        type="text" 
                        placeholder="Create a new todo..."
                        value={newTodo}
                        onChange={event => setNewTodo(event.target.value)}
                        onKeyDown={addTodo}
                    />
                </div>
                <div className="container-all-todo">
                    <Container dragClass="container-drag" onDrop={onDrop} orientation="vertical">
                        {listTodos.map( (todo, index) => (
                            <Draggable className="list-todos" key={index}>
                                <div style={{width: '100%'}}>
                                    <a onClick={() => checkTodo(index)} className={todo.completed ? 'icon-checked' : ''}>
                                        {todo.completed && (
                                            <img src={IconCheck} />
                                        )}
                                    </a>
                                    <p className={todo.completed ? 'text-checked' : 'text-unchecked'}>
                                        {todo.descript}
                                    </p>
                                </div>
                                <img onClick={() => removeTodo(index)} src={IconRemoveTodo} alt="" />
                            </Draggable>
                        ))}
                    </Container>

                    {listTodosOriginal.length > 0 && (
                        <div className="list-todos-footer">
                            <p>{listTodos.length} items left</p>
                            <div className="buttons-footer">
                                <p onClick={listAllTodos} className={buttonActive === 1 ? 'buttons-footer-active' : ''}>All</p>
                                <p onClick={listActiveTodos} className={buttonActive === 2 ? 'buttons-footer-active' : ''}>Active</p>
                                <p onClick={listCompletedTodos} className={buttonActive === 3 ? 'buttons-footer-active' : ''}>Completed</p>
                            </div>
                            <p onClick={clearCompleted}>Clear Completed</p>
                        </div>
                    )}
                </div>
                {listTodosOriginal.length > 0 && (
                    <div className="buttons-footer-mobile">
                        <p onClick={listAllTodos} className={buttonActive === 1 ? 'buttons-footer-active' : ''}>All</p>
                        <p onClick={listActiveTodos} className={buttonActive === 2 ? 'buttons-footer-active' : ''}>Active</p>
                        <p onClick={listCompletedTodos} className={buttonActive === 3 ? 'buttons-footer-active' : ''}>Completed</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
