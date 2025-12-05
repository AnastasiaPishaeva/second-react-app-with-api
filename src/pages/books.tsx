import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, TextField, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    searchBooks,
    getTrendingBooks,
    getBookCoverUrl,
    getBookDescription,
    getBookAuthor,
    truncateText
} from '../api/api-books';
import type { Book } from '../api/api-books';
import './books.css';

const Title = styled(Typography)`
    margin-top: 40px;
    font-size: 58px;
    font-weight: 800;
    font-family: 'Montserrat', sans-serif;
    line-height: normal;
    letter-spacing: 0.2px;
    color: #121212;
    text-align: center;
    margin-bottom: 20px;

    @media (max-width: 805px) {
        font-size: 50px;
    }

    @media (max-width: 600px) {
        font-size: 35px;
    }
`;

const SearchField = styled(TextField)`
    flex: 1;
    max-width: 450px;
    width: 100%;

    & .MuiOutlinedInput-root {
        font-family: 'Montserrat', sans-serif;
        font-size: 16px;
        padding: 15px 20px;
        border-radius: 25px;

        & fieldset {
            border: 2px solid #e0e0e0;
            border-radius: 25px;
        }

        &:hover fieldset {
            border-color: #b0b0b0;
        }

        &.Mui-focused fieldset {
            border-color: #121212;
        }
    }

    & .MuiInputBase-input {
        padding: 0;
    }

    @media (max-width: 768px) {
        max-width: 300px;
    }
`;

const SearchContainer = styled(Box)`
    display: flex;
    justify-content: center;
    margin: 20px 0 10px 0;
    width: 100%;
`;

const LoadMoreButton = styled(Button)`
    background: none;
    color: #121212;
    border: none;
    padding: 0;
    border-radius: 0;
    font-size: 16px;
    font-weight: 500;
    text-transform: none;
    box-shadow: none;
    margin-top: 40px;

    &:hover {
        background: none;
        text-decoration: underline;
    }

    &:active {
        transform: none;
    }
`;

const Books = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearchQuery, setCurrentSearchQuery] = useState('');
    const [categoryTitle, setCategoryTitle] = useState('Popular books');
    const [searchInput, setSearchInput] = useState('');
    const booksPerPage = 12;

    const loadInitialBooks = useCallback(async () => {
        setLoading(true);
        setCurrentPage(1);
        setCurrentSearchQuery('');
        setCategoryTitle('Popular books');

        try {
            const fetchedBooks = await getTrendingBooks(1, booksPerPage);
            setBooks(fetchedBooks);
        } catch (error) {
            console.error('Error loading books:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInitialBooks();
    }, [loadInitialBooks]);

    const performSearch = useCallback(async () => {
        const query = searchInput.trim();
        
        if (!query) {
            return;
        }

        setCurrentSearchQuery(query);
        setCurrentPage(1);
        setLoading(true);
        setCategoryTitle(`Search results: "${query}"`);

        try {
            const fetchedBooks = await searchBooks(query, 1, booksPerPage);
            setBooks(fetchedBooks);
        } catch (error) {
            console.error('Error searching books:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, [searchInput]);

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const loadMoreBooks = useCallback(async () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        setLoading(true);

        try {
            let fetchedBooks: Book[];

            if (currentSearchQuery) {
                fetchedBooks = await searchBooks(currentSearchQuery, nextPage, booksPerPage);
            } else {
                fetchedBooks = await getTrendingBooks(nextPage, booksPerPage);
            }

            if (fetchedBooks && fetchedBooks.length > 0) {
                setBooks((prevBooks: Book[]) => [...prevBooks, ...fetchedBooks]);
            }
        } catch (error) {
            console.error('Error loading more books:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, currentSearchQuery]);

    const renderBookCard = (book: Book) => {
        const title = book.title || 'Unknown book';
        const author = getBookAuthor(book);
        const year = book.first_publish_year || book.publish_date || '';
        const subjects = Array.isArray(book.subject) ? book.subject.slice(0, 3) : [];
        const description = getBookDescription(book);
        const rating = book.ratings_average || 0;
        const pages = book.number_of_pages_median || '';
        const coverUrl = getBookCoverUrl(book);
        const defaultCover = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEgxODBWMjgwSDIwVjIwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNMzAgNDBIMTcwVjI3MEgzMFY0MFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LXNpemU9IjE0Ij5ObyBDb3ZlcjwvdGV4dD4KPC9zdmc+';

        return (
            <div key={book.key} className="book-card">
                <img
                    src={coverUrl || defaultCover}
                    alt={title}
                    className="book-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = defaultCover;
                    }}
                />
                <div className="book-info">
                    <div className="book-title">{truncateText(title, 60)}</div>
                    <div className="book-author">{truncateText(author, 40)}</div>
                    {year && (
                        <div className="book-year">
                            {year}
                            {pages ? ` • ${pages} стр.` : ''}
                        </div>
                    )}
                    {subjects.length > 0 && (
                        <div className="book-subjects">
                            {subjects.map((subject, index) => (
                                <span key={index} className="subject-tag">
                                    {truncateText(subject, 15)}
                                </span>
                            ))}
                        </div>
                    )}
                    {description && (
                        <div className="book-description">
                            {truncateText(description, 120)}
                        </div>
                    )}
                    {rating > 0 && (
                        <div className="book-rating">
                            {rating.toFixed(1)}/5
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Grid container direction="column" alignItems="center">
            <Title>Your library</Title>

            <SearchContainer>
                <SearchField
                    placeholder="Search for books, authors, and genres..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    fullWidth={false}
                />
            </SearchContainer>

            <div className="books-display">
                {loading && books.length === 0 && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Uploading books...</p>
                    </div>
                )}

                {!loading && books.length === 0 && (
                    <div className="books-gallery">
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#121212' }}>
                            <h3>Books not found</h3>
                        </div>
                    </div>
                )}

                {books.length > 0 && (
                    <div className="books-gallery">
                        <h3 id="categoryTitle" className="category-title">{categoryTitle}</h3>
                        <div className="books-grid">
                            {books.map(renderBookCard)}
                        </div>
                        <LoadMoreButton onClick={loadMoreBooks} disabled={loading}>
                            {loading ? 'Loading...' : 'Upload more'}
                        </LoadMoreButton>
                    </div>
                )}
            </div>
        </Grid>
    );
};

export default Books;

