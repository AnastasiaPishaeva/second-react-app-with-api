const API_BASE_URL = 'https://openlibrary.org';

export interface Book {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    publish_date?: string;
    subject?: string[];
    cover_i?: number;
    isbn?: string[];
    number_of_pages_median?: number;
    ratings_average?: number;
    description?: string | { value: string };
}

export interface BookSearchResponse {
    docs: Book[];
    numFound: number;
}

export const searchBooks = async (query: string, page: number = 1, booksPerPage: number = 12): Promise<Book[]> => {
    const offset = (page - 1) * booksPerPage;
    const url = `${API_BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${booksPerPage}&offset=${offset}&fields=key,title,author_name,first_publish_year,subject,cover_i,isbn,number_of_pages_median,ratings_average,description`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return [];
        }
        const data: BookSearchResponse = await response.json();
        return Array.isArray(data.docs) ? data.docs : [];
    } catch (error) {
        console.error('Error searching books:', error);
        return [];
    }
};

export const getTrendingBooks = async (page: number = 1, booksPerPage: number = 12): Promise<Book[]> => {
    const popularTerms = ['bestseller', 'popular', 'classic', 'award'];
    const randomTerm = popularTerms[Math.floor(Math.random() * popularTerms.length)];
    return await searchBooks(randomTerm, page, booksPerPage);
};

export const getBookDetails = async (workKey: string): Promise<any> => {
    const url = `${API_BASE_URL}${workKey}.json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) return {};
        const data = await response.json();
        if (data.covers && data.covers.length > 0) {
            data.cover_i = data.covers[0];
        }
        return data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        return {};
    }
};

export const getBookCoverUrl = (book: Book): string => {
    if (book.cover_i) {
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
    } else if (book.isbn && book.isbn[0]) {
        return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
    }
    return '';
};

export const getBookDescription = (book: Book): string => {
    if (!book.description) return '';
    if (typeof book.description === 'string') {
        return book.description;
    }
    return book.description.value || '';
};

export const getBookAuthor = (book: Book): string => {
    if (book.author_name && book.author_name.length > 0) {
        return book.author_name[0];
    }
    return 'Unknown author';
};

export const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

