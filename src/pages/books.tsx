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

const PageContainer = styled(Grid)`
    width: 100%;
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

const BooksDisplay = styled('div')`
    margin-top: 30px;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const LoadingBox = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const Spinner = styled('div')`
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #121212;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const BooksGallery = styled('div')`
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    width: 100%;
`;

const CategoryTitle = styled(Typography)`
    color: #121212;
    margin-bottom: 20px;
    font-size: 28px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 750;
    text-transform: capitalize;
    margin-top: 10px;

    @media (max-width: 600px) {
        font-size: 24px;
    }
`;

const BooksGrid = styled('div')`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
    width: 100%;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }

    @media (max-width: 600px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
    }
`;

const BookCard = styled('div')`
    background: #f8f9fa;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }
`;

const BookCover = styled('img')`
    width: 100%;
    height: 350px;
    object-fit: cover;
    border-radius: 15px 15px 0 0;
    background: #f0f0f0;

    @media (max-width: 768px) {
        height: 300px;
    }

    @media (max-width: 600px) {
        height: 250px;
    }
`;

const BookInfo = styled('div')`
    padding: 25px;
    background: #f8f9fa;
    text-align: left;

    @media (max-width: 768px) {
        padding: 20px;
    }

    @media (max-width: 600px) {
        padding: 15px;
    }
`;

const BookTitleText = styled(Typography)`
    color: #333;
    font-size: 18px;
    font-weight: 700;
    font-family: 'Montserrat', sans-serif;
    margin-bottom: 10px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: 600px) {
        font-size: 16px;
    }
`;

const BookAuthorText = styled(Typography)`
    color: #666;
    font-size: 14px;
    font-family: 'Montserrat', sans-serif;
    margin-bottom: 8px;
    font-style: italic;
`;

const BookYearText = styled(Typography)`
    color: #999;
    font-size: 12px;
    font-family: 'Montserrat', sans-serif;
    margin-bottom: 10px;
`;

const BookSubjects = styled('div')`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 15px;
`;

const SubjectTag = styled(Typography)`
    background: #e0e0e0;
    color: #121212;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
`;

const BookDescriptionText = styled(Typography)`
    color: #555;
    font-size: 13px;
    font-family: 'Montserrat', sans-serif;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 0;
`;

const BookRating = styled(Typography)`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #121212;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Montserrat', sans-serif;
    margin-top: 10px;
`;

const LoadMoreButton = styled(Button)`
    background: none;
    color: #121212;
    border: none;
    padding: 0;
    border-radius: 0;
    font-size: 16px;
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
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
            <BookCard key={book.key}>
                <BookCover
                    src={coverUrl || defaultCover}
                    alt={title}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = defaultCover;
                    }}
                />
                <BookInfo>
                    <BookTitleText as="div">{truncateText(title, 60)}</BookTitleText>
                    <BookAuthorText as="div">{truncateText(author, 40)}</BookAuthorText>
                    {year && (
                        <BookYearText as="div">
                            {year}
                            {pages ? ` • ${pages} стр.` : ''}
                        </BookYearText>
                    )}
                    {subjects.length > 0 && (
                        <BookSubjects>
                            {subjects.map((subject, index) => (
                                <SubjectTag key={index} as="span">{truncateText(subject, 15)}</SubjectTag>
                            ))}
                        </BookSubjects>
                    )}
                    {description && <BookDescriptionText as="div">{truncateText(description, 120)}</BookDescriptionText>}
                    {rating > 0 && <BookRating as="div">{rating.toFixed(1)}/5</BookRating>}
                </BookInfo>
            </BookCard>
        );
    };

    return (
        <PageContainer container direction="column" alignItems="center">
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

            <BooksDisplay>
                {loading && books.length === 0 && (
                    <LoadingBox>
                        <Spinner />
                        <Typography sx={{ fontFamily: "'Montserrat', sans-serif" }}>Uploading books...</Typography>
                    </LoadingBox>
                )}

                {!loading && books.length === 0 && (
                    <BooksGallery>
                        <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#121212' }}>
                            <Typography variant="h6" sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                                Books not found
                            </Typography>
                        </Box>
                    </BooksGallery>
                )}

                {books.length > 0 && (
                    <BooksGallery>
                        <CategoryTitle id="categoryTitle">{categoryTitle}</CategoryTitle>
                        <BooksGrid>{books.map(renderBookCard)}</BooksGrid>
                        <LoadMoreButton onClick={loadMoreBooks} disabled={loading}>
                            {loading ? 'Loading...' : 'Upload more'}
                        </LoadMoreButton>
                    </BooksGallery>
                )}
            </BooksDisplay>
        </PageContainer>
    );
};

export default Books;

