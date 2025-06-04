import { useState, useRef, useEffect } from 'react';
import styles from './ToDoList.module.css';

const AITaskManager = ({ tasks, onAddTask, onEditTask, onDeleteTask, onCompleteTask, isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI task manager. I can help you manage your tasks. You can ask me to add, edit, or delete tasks. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const systemPrompt = `You are an AI task manager assistant. Your role is to help users manage their tasks effectively. You can:
1. Add new tasks with name, details, and priority (high/medium/low)
2. Edit existing tasks
3. Delete tasks
4. Mark tasks as complete
5. Provide advice on task organization and prioritization

When adding or editing tasks, format your response like this:
"Adding task: [task name] with [priority] priority"
or
"Editing task [number]: [new task name] with [priority] priority"

When marking tasks as complete, say:
"Marking task [number] as complete"

When deleting tasks, say:
"Deleting task [number]"

Format your responses in a natural, conversational manner. When suggesting task changes, explain your reasoning.

Current tasks:
${tasks.map((task, index) => `${index + 1}. ${task.title} (${task.priority} priority)${task.completed ? ' ✓' : ''}`).join('\n')}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            console.log('Sending request to API...');
            const response = await fetch('https://api.metisai.ir/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer tpsg-j3BwjgninK5hRPfYIyFZoZhnICDE7Ai'
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages,
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error('Invalid response format:', data);
                throw new Error('Invalid response format from API');
            }

            const aiResponse = data.choices[0].message.content;
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

            if (aiResponse.toLowerCase().includes('adding task:')) {
                const taskMatch = aiResponse.match(/adding task:\s*([^.]+)\s+with\s+(high|medium|low)\s+priority/i);
                if (taskMatch) {
                    const title = taskMatch[1].trim();
                    const priority = taskMatch[2].toLowerCase();
                    onAddTask({ title, priority, completed: false });
                }
            } else if (aiResponse.toLowerCase().includes('editing task')) {
                const taskMatch = aiResponse.match(/editing task\s*(\d+):\s*([^.]+)\s+with\s+(high|medium|low)\s+priority/i);
                if (taskMatch) {
                    const taskId = parseInt(taskMatch[1]);
                    const title = taskMatch[2].trim();
                    const priority = taskMatch[3].toLowerCase();
                    onEditTask(taskId, { title, priority });
                }
            } else if (aiResponse.toLowerCase().includes('deleting task')) {
                const taskMatch = aiResponse.match(/deleting task\s*(\d+)/i);
                if (taskMatch) {
                    const taskId = parseInt(taskMatch[1]);
                    onDeleteTask(taskId);
                }
            } else if (aiResponse.toLowerCase().includes('marking task') && aiResponse.toLowerCase().includes('complete')) {
                const taskMatch = aiResponse.match(/marking task\s*(\d+)\s+as complete/i);
                if (taskMatch) {
                    const taskId = parseInt(taskMatch[1]);
                    onCompleteTask(taskId);
                }
            }
        } catch (error) {
            console.error('Detailed error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `Error: ${error.message}. Please check the console for details.` 
            }]);
        }

        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.aiChatOverlay} onClick={onClose} />
            <div className={styles.aiChatContainer}>
                <div className={styles.aiChatHeader}>
                    <h2>AI Task Manager</h2>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>
                <div className={styles.chatMessages}>
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`${styles.message} ${message.role === 'assistant' ? styles.assistant : styles.user}`}
                        >
                            {message.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className={`${styles.message} ${styles.assistant}`}>
                            Thinking...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className={styles.chatInput}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me to manage your tasks..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        Send
                    </button>
                </form>
            </div>
        </>
    );
};

export default AITaskManager; 