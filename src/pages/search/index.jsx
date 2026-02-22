import BookPreview from "../../components/bookPreview";
import { useState, useRef } from 'react'
import styles from './style.module.css'

export default function Search() {
  // stores search results
  const [bookSearchResults, setBookSearchResults] = useState()
  // stores value of input field
  const [query, setQuery] = useState("")
  // compare to query to prevent repeat API calls
  const [previousQuery, setPreviousQuery] = useState()
  // used to prevent rage clicks on form submits
  const [fetching, setFetching] = useState(false)

  // TODO: When the Search Page loads, use useEffect to fetch data from:
  // https://www.googleapis.com/books/v1/volumes?langRestrict=en&maxResults=16&q=YOUR_QUERY
  // Use a query of "React"

  useEffect(() => {
    const fetchInitialBooks = async () => {
      setFetching(true)
      try {
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?langRestrict=en&maxResults=16&q=React"
        )
        const data = await response.json()
        setBookSearchResults(data.items)
        setPreviousQuery("React")
      } catch (error) {
        console.error("Error fetching books:", error)
        setBookSearchResults([])
      } finally {
        setFetching(false)
      }
    }
    fetchInitialBooks()
  }, [])

  // TODO: Write a submit handler for the form that fetches data from:
  // https://www.googleapis.com/books/v1/volumes?langRestrict=en&maxResults=16&q=YOUR_QUERY
  // and stores the "items" property in the result to the bookSearchResults variable
  // This function MUST prevent repeat searches if:
  // fetch has not finished
  // the query is unchanged

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (fetching || !query || query === previousQuery) {
      return
    }
    setFetching(true)
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?langRestrict=en&maxResults=16&q=${query}`
      )
      const data = await response.json()
      setBookSearchResults(data.items)
      setPreviousQuery(query)
      } catch (error) {
      console.error("Error fetching books:", error)
      setBookSearchResults([])
    } finally {
      setFetching(false)
    }
  }

  const inputRef = useRef()
  const inputDivRef = useRef()

  return (
    <main className={styles.search}>
      <h1>Book Search</h1>
      {/* TODO: add an onSubmit handler */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="book-search">Search by author, title, and/or keywords:</label>
        <div ref={inputDivRef}>
          {/* TODO: add value and onChange props to the input element based on query/setQuery */}
          <input
            ref={inputRef}
            type="text"
            name="book-search"
            id="book-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
          <button type="submit">Submit</button>
        </div>
      </form>
      {
        // if loading, show the loading component
        // else if there are search results, render those
        // else show the NoResults component
        fetching
        ? <Loading />
        : bookSearchResults?.length
        ? <div className={styles.bookList}>
            {/* TODO: render BookPreview components for each search result here based on bookSearchResults */}
          {bookSearchResults?.map((book) => {
              const volumeInfo = book.volumeInfo;
              return (
                <BookPreview
                  key={book.id}
                  title={volumeInfo.title}
                  authors={volumeInfo.authors}
                  thumbnail={volumeInfo.imageLinks?.thumbnail}
                  previewLink={volumeInfo.previewLink}
                />
              )
            })}
          </div>
        : <NoResults
          {...{inputRef, inputDivRef, previousQuery}}
          clearSearch={() => setQuery("")}/>
      }
    </main>
  )
}

function Loading() {
  return <span className={styles.loading}>Loading...⌛</span>
}

function NoResults({ inputDivRef, inputRef, previousQuery, clearSearch }) {
  function handleLetsSearchClick() {
    inputRef.current.focus()
    if (previousQuery) clearSearch()
    if (inputDivRef.current.classList.contains(styles.starBounce)) return
    inputDivRef.current.classList.add(styles.starBounce)
    inputDivRef.current.onanimationend = function () {
      inputDivRef.current.classList.remove(styles.starBounce)
    }
  }
  return (
    <div className={styles.noResults}>
      <p><strong>{previousQuery ? `No Books Found for "${previousQuery}"` : "Nothing to see here yet. 👻👀"}</strong></p>
      <button onClick={handleLetsSearchClick}>
        {
          previousQuery
          ? `Search again?`
          : `Let's find a book! 🔍`
        }
      </button>
    </div>
  )
}