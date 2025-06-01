import BookMarkCard from "../../Components/BookMarkCard/BookMarkCard";
import styles from "./HomePage.module.css";
import initialBookmarks from "../../Data/BookmarksData";
import { useState, useEffect } from "react";
import Modal from "../../Components/Modal/Modal"


const Homepage = () => {
    const [bookmarks, setBookmarks] = useState(initialBookmarks);
    const [openCreateUserModal, setOpenCreateUserModal] = useState(false);
    const [editBookmark, setEditBookmark] = useState(null);
    const [deleteBookmark, setDeleteBookmark] = useState(null);

    useEffect(() => {
        const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        if (storedBookmarks) {
            setBookmarks(storedBookmarks);
        }
    }, []);

    const BookMarkManagementForm = ({data, onCancel, hideCloseButton = false, cancelButtonText = 'Cancel'}) => {
        const isCreateMode = !data;

        const [form, setForm] = useState({
            name: data?.name || '',
            url: data?.url || '',
        })

        const handleChange = (e) => {
            setForm({...form, [e.target.name]: e.target.value})
        }

        const handleSubmit = (e) => {
            e.preventDefault();
            if (isCreateMode) {
                const newBookmarks = [...bookmarks, form];
                setBookmarks(newBookmarks);
                localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
                setOpenCreateUserModal(false);
            } else {
                const newBookmarks = bookmarks.map(bookmark => 
                    bookmark === data ? form : bookmark
                );
                setBookmarks(newBookmarks);
                localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
                setEditBookmark(null);
            }
        }

        return (
            <form className={styles.BookMarkForm} onSubmit={handleSubmit}>
                <input type="text" className={styles.formInput} value={form.name} placeholder="Book Mark name" name="name" onChange={handleChange} required/>
                <input type="text" className={styles.formInput} value={form.url} placeholder="Book Mark URL" name="url" onChange={handleChange} required/>
                <div className={styles.buttonGroup}>
                    <button className={styles.submitButton} type="submit">
                        {isCreateMode ? 'Create' : 'Update'}
                    </button>
                    {!hideCloseButton &&
                        <button className={styles.cancelButton} onClick={() => onCancel()}>
                            {cancelButtonText}
                        </button>
                    }
                </div>
            </form>
        )
    }

    const handleDelete = (index) => {
        const newBookmarks = [...bookmarks];
        newBookmarks.splice(index, 1);
        setBookmarks(newBookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
        setDeleteBookmark(null);
    }

    const handleEdit = (bookmark) => {
        setEditBookmark(bookmark);
    }

    const DeleteConfirmationModal = ({bookmark, onConfirm, onCancel}) => {
        return (
            <div className={styles.deleteConfirmation}>
                <p>Are you sure you want to delete "{bookmark.name}"?</p>
                <div className={styles.buttonGroup}>
                    <button className={styles.submitButton} onClick={onConfirm}>
                        Delete
                    </button>
                    <button className={styles.cancelButton} onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={styles.header}>
                <h1>BookMarks</h1>
                <button className={styles.addBookMarkButton} onClick={() => setOpenCreateUserModal(true)}>Add Bookmark</button>
            </div>
            {openCreateUserModal && 
                <Modal 
                    hideCloseButton={true}
                    hideSubmitButton={true}
                    title="Create BookMark" 
                    description={
                        <BookMarkManagementForm 
                            data={null}
                            onSubmit={(bookmark) => {
                                setBookmarks([...bookmarks, bookmark]);
                                setOpenCreateUserModal(false);
                            }} 
                            onCancel={() => setOpenCreateUserModal(false)} 
                            cancelButtonText="close"
                        />
                    }
                />
            }
            {editBookmark && 
                <Modal 
                    hideCloseButton={true}
                    hideSubmitButton={true}
                    title="Edit Bookmark" 
                    description={
                        <BookMarkManagementForm 
                            data={editBookmark}
                            onSubmit={() => {
                                setEditBookmark(null);
                            }} 
                            onCancel={() => setEditBookmark(null)} 
                            cancelButtonText="close"
                        />
                    }
                />
            }
            {deleteBookmark && 
                <Modal 
                    hideCloseButton={true}
                    hideSubmitButton={true}
                    title="Delete Bookmark" 
                    description={
                        <DeleteConfirmationModal 
                            bookmark={deleteBookmark}
                            onConfirm={() => handleDelete(bookmarks.indexOf(deleteBookmark))}
                            onCancel={() => setDeleteBookmark(null)}
                        />
                    }
                />
            }
            <div className={styles.bookmarkGrid}>
                {bookmarks.map((bookmark, index) => (
                    <BookMarkCard
                        key={index}
                        name={bookmark.name}
                        url={bookmark.url}
                        handleDelete={() => setDeleteBookmark(bookmark)}
                        handleEdit={() => handleEdit(bookmark)}
                    />
                ))}
            </div>
        </>
    )
}

export default Homepage;