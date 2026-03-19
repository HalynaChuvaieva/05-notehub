import { useState } from 'react'
import css from './App.module.css'
import SearchBar  from '../SearchBar/SearchBar'
import fetchMovie from '../../services/movieService'
import { Toaster, toast } from 'react-hot-toast'
import type { Movie } from '../../types/movie'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import Pagination from '../Pagination/Pagination'

export default function App() {
    const [topic, setTopic] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie| null>(null);

    
    const openModal = (movie: Movie) => {
        setSelectedMovie(movie);
    };
    const closeModal = () => {
        setSelectedMovie(null);
    };

    const { data, isLoading, isError, isSuccess } = useQuery({
            queryKey: ['movies', topic, currentPage],
            queryFn: () => fetchMovie({ query: topic, page: currentPage }),
            enabled: topic !== '',
            placeholderData: keepPreviousData,
    });
    const totalPages = data?.total_pages || 0;
    const handleSubmit = async (formData: FormData) => {

        const query = formData.get("query") as string;
        
        if (!query.trim()) {
            toast.error("Please enter your search query.");
            return;
        }
        
        setTopic(query);
        setCurrentPage(1);
        
    }

    return (
        <div className={css.app}>
            <Toaster />
            <SearchBar onSubmit={handleSubmit} />
            {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />}

            {isLoading && <Loader />}
            {isError && <ErrorMessage/>}
            {isSuccess && data && data.results.length > 0 && (<MovieGrid movies={data.results} onSelect={openModal} />)}
            {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
        </div>
    )
}
