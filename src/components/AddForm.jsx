import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import { set, ref, push } from 'firebase/database';
import {db, storage} from "../services/firebase";
import { ref as sRef } from 'firebase/storage';
import { uploadBytes } from "firebase/storage";

export function AddForm({setShowForm, task}) {
    let calendar = require('dayjs/plugin/calendar')
    dayjs.extend(calendar)

    /**Локальные состояния инпутов**/
    const [status, setStatus] = useState('new')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState(dayjs().calendar(dayjs('')))
    /**Доступ к элементу загрузки файлов**/
    const fileInput = useRef();

    /**Установка актуальных значений задачи для их изменения**/
    useEffect(() => {
        if(task){
            setStatus(task.status)
            setName(task.name)
            setDescription(task.description)
            setDeadline(task.deadline)
        }
    }, [task])

    /**
     * Функция отправки данных
     * @param {e} a - Событие формы
     */
    const handleData = (e) => {
        e.preventDefault();
        const files = Object.values(fileInput.current.files)
        let filesPath = []
        if(files){
            files.map(file => {
                const storageRef = sRef(storage, `${file.name}`);
                uploadBytes(storageRef, file).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                });
                const path = sRef(storage, `${file.name}`)
                filesPath.push(path.fullPath)
                return filesPath
            })
        }
        const data = {
            name,
            description,
            deadline,
            filesPath,
            status
        }
        if(task){
            set(ref(db, `tasks/${task.key}`), data)
        } else{
            const newPostRef = push(ref(db, 'tasks'));
            set(newPostRef, data);
        }
        setShowForm(false)
    }

    return (
        <form className="addForm" onSubmit={handleData}>
            {task && <select className="formField" value={status}
                    onChange={(e) => setStatus(e.currentTarget.value)}>
                <option value="new">new</option>
                <option value="done">done</option>
                <option value="overdue">overdue</option>
            </select>}
            <input className="formField" type="text" placeholder='Название задачи'
                   value={name} onChange={(e) => setName(e.currentTarget.value)}/>
            <input className="formField" type="text" placeholder='Описание задачи'
                   value={description} onChange={(e) => setDescription(e.currentTarget.value)}/>
            <input className="formField" type="text" value={deadline}
                   onChange={(e) => setDeadline(e.currentTarget.value)}/>
            <input className="fileInput" type="file" multiple ref={fileInput}/>
            <button className="formBtn" type="submit">Сохранить</button>
            <button className="icon-cross" onClick={() => setShowForm(false)}></button>
        </form>
    );
}