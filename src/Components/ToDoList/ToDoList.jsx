import styles from "./ToDoList.module.css";
import { useState, useEffect } from "react";
import Tasks from "../../Data/Tasks";
import AITaskManager from "./AITaskManager";

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        detail: '',
        priority: '',
        completed: false
    });
    const [editingTask, setEditingTask] = useState(null);
    const [isInputActive, setIsInputActive] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        } else {
            setTasks(Tasks);
            localStorage.setItem('tasks', JSON.stringify(Tasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = (task) => {
        if (task) {
            const updatedTasks = [...tasks, { ...task, id: Date.now() }];
            setTasks(updatedTasks);
        } else if (newTask.title && newTask.priority) {
            const updatedTasks = [...tasks, { ...newTask, id: Date.now() }];
            setTasks(updatedTasks);
            setNewTask({ title: '', detail: '', priority: '', completed: false });
            setIsInputActive(false);
        }
    };

    const handleUpdateTask = () => {
        if (!editingTask.title || !editingTask.priority) return;
        const updatedTasks = tasks.map(task => 
            task.id === editingTask.id ? editingTask : task
        );
        setTasks(updatedTasks);
        setEditingTask(null);
        setIsInputActive(false);
    };

    const handleDeleteTask = (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsInputActive(true);
    };

    const handleCompleteTask = (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
    };

    const getPriorityColor = (priority, isActive = false) => {
        const opacity = isActive ? '1' : '0.3';
        switch(priority) {
            case 'high': return `rgba(255, 59, 48, ${opacity})`;
            case 'medium': return `rgba(255, 149, 0, ${opacity})`;
            case 'low': return `rgba(52, 199, 89, ${opacity})`;
            default: return 'transparent';
        }
    };

    const getPriorityLabel = (priority) => {
        switch(priority) {
            case 'high': return 'High Priority';
            case 'medium': return 'Medium Priority';
            case 'low': return 'Low Priority';
            default: return 'Select Priority';
        }
    };

    return (
        <div className={styles.taskContainer}>
            <div className={styles.taskHeader}>
                <h1>Tasks</h1>
                <button 
                    className={styles.aiButton}
                    onClick={() => setIsAIChatOpen(true)}
                >
                    AI Assistant
                </button>
            </div>
            <div className={styles.taskList}>
                {tasks.map(task => (
                    <div key={task.id} className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}>
                        <div className={styles.taskContent}>
                            <div className={styles.taskHeader}>
                                <button 
                                    className={styles.completeButton}
                                    onClick={() => handleCompleteTask(task.id)}
                                    disabled={task.completed}
                                >
                                    {task.completed ? '✓' : '□'}
                                </button>
                                <h3>{task.title}</h3>
                            </div>
                            <p>{task.detail}</p>
                            <div className={styles.priorityDot} style={{ backgroundColor: getPriorityColor(task.priority, true) }} />
                        </div>
                        <div className={styles.taskActions}>
                            <button onClick={() => handleEditTask(task)}>Edit</button>
                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.taskInput}>
                <div className={`${styles.inputFields} ${isInputActive ? styles.active : ''}`}>
                    <input
                        type="text"
                        placeholder="Task title"
                        value={editingTask ? editingTask.title : newTask.title}
                        onChange={(e) => editingTask 
                            ? setEditingTask({...editingTask, title: e.target.value})
                            : setNewTask({...newTask, title: e.target.value})
                        }
                        onFocus={() => setIsInputActive(true)}
                    />
                    <input
                        type="text"
                        placeholder="Task details"
                        value={editingTask ? editingTask.detail : newTask.detail}
                        onChange={(e) => editingTask
                            ? setEditingTask({...editingTask, detail: e.target.value})
                            : setNewTask({...newTask, detail: e.target.value})
                        }
                    />
                </div>
                <div className={`${styles.priorityDots} ${isInputActive ? styles.active : ''}`}>
                    <div className={styles.priorityLabel}>
                        {getPriorityLabel(editingTask ? editingTask.priority : newTask.priority)}
                    </div>
                    <div className={styles.priorityButtons}>
                        <button 
                            className={`${styles.priorityDot} ${(editingTask ? editingTask.priority : newTask.priority) === 'high' ? styles.active : ''}`}
                            style={{ backgroundColor: getPriorityColor('high', (editingTask ? editingTask.priority : newTask.priority) === 'high') }}
                            onClick={() => editingTask
                                ? setEditingTask({...editingTask, priority: 'high'})
                                : setNewTask({...newTask, priority: 'high'})
                            }
                        />
                        <button 
                            className={`${styles.priorityDot} ${(editingTask ? editingTask.priority : newTask.priority) === 'medium' ? styles.active : ''}`}
                            style={{ backgroundColor: getPriorityColor('medium', (editingTask ? editingTask.priority : newTask.priority) === 'medium') }}
                            onClick={() => editingTask
                                ? setEditingTask({...editingTask, priority: 'medium'})
                                : setNewTask({...newTask, priority: 'medium'})
                            }
                        />
                        <button 
                            className={`${styles.priorityDot} ${(editingTask ? editingTask.priority : newTask.priority) === 'low' ? styles.active : ''}`}
                            style={{ backgroundColor: getPriorityColor('low', (editingTask ? editingTask.priority : newTask.priority) === 'low') }}
                            onClick={() => editingTask
                                ? setEditingTask({...editingTask, priority: 'low'})
                                : setNewTask({...newTask, priority: 'low'})
                            }
                        />
                    </div>
                </div>
                <div className={styles.actionButtons}>
                    {editingTask ? (
                        <>
                            <button onClick={handleUpdateTask}>Update</button>
                            <button onClick={() => {
                                setEditingTask(null);
                                setIsInputActive(false);
                            }}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => handleAddTask()}>Add Task</button>
                    )}
                </div>
            </div>
            <AITaskManager
                isOpen={isAIChatOpen}
                onClose={() => setIsAIChatOpen(false)}
                tasks={tasks}
                onAddTask={handleAddTask}
                onEditTask={(taskId, updates) => {
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        handleEditTask({...task, ...updates});
                    }
                }}
                onDeleteTask={handleDeleteTask}
                onCompleteTask={handleCompleteTask}
            />
        </div>
    );
};

export { TaskManagement };