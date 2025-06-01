import styles from './BookMarkCard.module.css';
import initialBookmarks from '../../Data/BookMarksData';
import { useState, useEffect } from 'react';


const BookMarkCard = ({name, url, handleDelete, handleEdit}) => {
    return (
        <div className={styles.root}>
            <div className={styles.card}>
                <div className={styles.buttons}>
                    <div className={styles.red}>
                        <button onClick={handleDelete}></button>
                    </div>
                    <div className={styles.yello}>
                        <button onClick={handleEdit}></button>
                    </div>
                    <div className={styles.green}>
                        <button onClick={() => {window.open(url, '_blank')}}></button>
                    </div>
                </div>
                <div className={styles.name}>
                    <h2>{name}</h2>
                </div>
            </div>
        </div>
    )
}

export default BookMarkCard;