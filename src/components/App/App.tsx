import { useState } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";

export default function App() {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", searchValue, page],
    queryFn: () => fetchNotes(searchValue, page),
    placeholderData: keepPreviousData,
  });

  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value.trim());
      setPage(1);
    },
    500,
  );
  const closeModal = () => setIsModalOpen(false);

  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onSearch={handleChange} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
