import { remove, ref } from 'firebase/database';
import {db, storage} from "../services/firebase";
import { ref as sRef, deleteObject, getDownloadURL} from 'firebase/storage';
import {useState, useEffect} from "react";

export function Task({task, onUpdateTask}) {

    /**Локальное состояние отображения загруженных файлов**/
    const [paths, setPaths] = useState('')

    /**Изменение типа данных состояния отображения загруженных файлов из массива в строку**/
    useEffect(() => {
        if(task.filesPath){
            const p = task.filesPath.map(path => {
                let arr = []
                arr.push(path)
                return arr
            })
            setPaths(p.join(', '))
        }
    }, [task.filesPath, paths])

    /**
     * Функция удаления задачи
     * @param {key} - Ключ задачи
     */
    const onDeleteTask = (key) => {
        remove(ref(db, `tasks/${key}`));
        if(task.filesPath){
            task.filesPath.map(path => {
                deleteObject(sRef(storage, `${path}`)).then(() => {
                    console.log('File deleted successfully')
                }).catch((error) => {
                    console.log(error)
                });
            })
        }
    }

    /**Функция загрудки файлов,открывает загруженные файлы в новом окне**/
    const onDownloadFiles = () => {
        task.filesPath.map(path => {
            getDownloadURL(sRef(storage, `${path}`))
                .then((url) => {
                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = (event) => {
                        const blob = xhr.response;
                    };
                    xhr.open('GET', url);
                    xhr.send();
                    // return document.location.href = url;
                    return window.open(url)
                })
                .catch((error) => {
                    // Handle any errors
                });
         })

    }

    return (
        <ul className={`status icon-${task.status}`}>
            <li>{task.name}</li>
            <li>{task.description}</li>
            <li>{task.deadline}</li>
            <li>{paths}</li>
            <li className="buttons">
                {task.filesPath && <button className="download" onClick={onDownloadFiles}>Скачать файлы</button>}
                <button className="icon-pencil" onClick={() => onUpdateTask(task.key)}></button>
                <button className="icon-bin" onClick={() => onDeleteTask(task.key)}></button>
            </li>
        </ul>
    );
}
