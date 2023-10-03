import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

const URL = "https://openlibrary.org/search.json?q="; // Replace this with your actual API URL

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultTitle, setResultTitle] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}${searchTerm}`);
        const data = response.data;
        const { docs } = data;

        if (docs) {
          const newBooks = docs.slice(0, 20).map((bookSingle) => {
            const {
              key,
              author_name,
              cover_i,
              edition_count,
              first_publish_year,
              title,
            } = bookSingle;

            return {
              id: key,
              author: author_name,
              cover_id: cover_i,
              edition_count: edition_count,
              first_publish_year: first_publish_year,
              title: title,
            };
          });

          setBooks(newBooks);

          if (newBooks.length > 0) {
            setResultTitle(`Your Search Result For: ${searchTerm}`);
          } else {
            setResultTitle("No Search Result Found!");
          }
        } else {
          setBooks([]);
          setResultTitle("No Search Result Found!");
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm]);

  return (
    <AppContext.Provider
      value={{
        loading,
        books,
        searchTerm,
        setSearchTerm,
        resultTitle,
        setResultTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
