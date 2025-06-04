import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (searchQuery) => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSuggestions(data[1] || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        fetchSuggestions(value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(suggestion)}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    };

    return (
        <div className={styles.container} ref={searchRef}>
            <div className={styles.searchBar}>
                <form onSubmit={handleSubmit} className={styles.searchBarForm}>
                    <input
                        type="text"
                        className={styles.searchBarInput}
                        placeholder="Search..."
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => setShowSuggestions(true)}
                    />
                    <button 
                        className={styles.submitSearchBar}
                        type="submit"
                    >
                        Search
                    </button>
                </form>
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <div className={styles.suggestions}>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className={styles.suggestionItem}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <span className={styles.suggestionIcon}>🔍</span>
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;