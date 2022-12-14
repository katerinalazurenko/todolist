import React, {useEffect, useState} from 'react';
import {onValue, ref, set} from 'firebase/database';
import {db, getTasks} from "../services/firebase";
import {Task} from "./Task";
import {AddForm} from "./AddForm";
import dayjs from "dayjs";

export function Todolist() {
    /**Локальное состояние списка всех задач**/
    const [tasksData, setTasksData] = useState([])
    /**Локальное состояние формы**/
    const [showForm, setShowForm] = useState(false)
    /**Локальное состояние режима редактирования**/
    const [editMode, setEditMode] = useState(false)
    /**Локальное состояние редактируемой задачи**/
    const [updatedTask, setUpdatedTask] = useState()

    /**Выведение списка данных из базы данных**/
    useEffect(() => {
        const tasksUnsubscribe = onValue(getTasks(), (snapshot) => {
            const arr = []
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                childData.key = childKey
                arr.push(childData)
            });
            setTasksData(arr);
        });

        return () => {
            tasksUnsubscribe();
        };
    },[]);

    /**Смена статуса на overdue если срок задачи истек**/
    useEffect(() => {
        tasksData.map(task => {
            const today = dayjs()
            if(today.diff(task.deadline) > 0){
                set(ref(db, `tasks/${task.key}/status`), 'overdue')
            }
        })
    },[tasksData]);

    /**Получение редактируемой задачи**/
    const onUpdateTask = (key) => {
        setShowForm(true)
        setEditMode(true)
        const task = tasksData.find(task => task.key === key)
        setUpdatedTask(task)
    }

    /**Открытие окна формы при добавлении новой задачи**/
    const onAddTask = () =>{
        setShowForm(true)
    }

    const tasks = tasksData.map(task => <Task key={task.key} task={task} onUpdateTask={onUpdateTask}/>)

    return (
        <>
            <ul className='headers'>
                <li>Название</li>
                <li>Описание</li>
                <li>Дата завершения</li>
                <li>Файлы</li>
            </ul>
            {tasks}
            <button className='icon-box-add' onClick={onAddTask}><span>Добавить задачу</span></button>
            {!editMode && showForm && <AddForm setShowForm={setShowForm}/>}
            {editMode && showForm && <AddForm setShowForm={setShowForm} task={updatedTask}/>}
        </>

    );
}

