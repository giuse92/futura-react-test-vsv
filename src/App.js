import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const ALLCATEGORIESURL = 'https://api.chucknorris.io/jokes/categories'
const RANDOMJOKEBYCATURL = 'https://api.chucknorris.io/jokes/random?category=' // remember to fill this
const ALLLJOKESBYKEYWORD = 'https://api.chucknorris.io/jokes/search?query=' // remember to fill this
const launchErrorAlert = () => setTimeout(() => window.alert('errore!'), 500)

// classe 'App-logo-spinning' durante il caricamento, altrimenti classe 'App-logo'
const Logo = ({ loading }) => {
  return (
    <img
      src={logo}
      alt='interactive-logo'
      className={!loading ? "App-logo-spinning" : "App-logo"}
    />
  )
}

const CategoryButton = ({ title, onClick }) => {
  return (
   <button className="Cat-button" onClick={onClick}>
     <code>{title}</code>
   </button>
  )
}


const CategoriesList = ({ categories, onCategoryClick }) => {
  return (
    <>
      {categories.map((category, i) => {
        return (
          <div key={`category-n-${i}`}>
            <CategoryButton title={category} onClick={onCategoryClick} />
          </div>
        )
      })}
    </>
  )
  // per ciascun elemento di 'categories' renderizzare il componente <CategoryButton />
}

const Joke = ({ value, categories }) => {

  return (
    <div className="Joke">
      <code className="Joke-Value">{value}</code>
      <span className="Selected-Cat" style={categories === undefined ? {display: "none"} : null}>
        <code>{categories}</code>
      </span>
    </div>
  )
}

// class App extends React.Component {
function App() {
  // qui tutto ciò che serve al componente per essere inizializzato
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [jokeByKw, setJokeByKw] = useState("");
  const [errorCategories, setErrorCategories] = useState(false);
  const [isLoadedCategories, setIsLoadedCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedTagState, setSelectedTagState] = useState("");


  // getAllCategories
  // funzione che deve recuperare l'array di tutte le categorie esistenti e salvarlo
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await fetch(ALLCATEGORIESURL);
        const result = await response.json();
        setCategories(result);
      } catch (err) {
        setErrorCategories(true);
        console.error(err);
      } finally {
        setIsLoadedCategories(true);
      }
    };

    getAllCategories();
  }, [])

  // onCategoryClick
  // funzione richiamata al click del componente CategoryButton
  const onCategoryClick = (e) => {
    setSelectedTagState(e.target.textContent);
  }

  // getRandomJokeByCat
  // funzione che recupera una singola barzelletta e la salva
  const getJokeByKeyword = async () => {
    try {
      setIsLoaded(false);
      const response = await fetch(ALLLJOKESBYKEYWORD + searchValue);
      const result = await response.json();
      if (result && result.status) {
        setJokeByKw(result.message); 
        throw new Error(result.error);
      };
      if (result && result.result.length === 0) {
        setJokeByKw("Quote not found");
        throw new Error("Quote not found")
      };
      setJokeByKw(result.result[0]);
    } catch (err) {
      launchErrorAlert();
      console.error(err);
      setError(true);
    } finally {
      setIsLoaded(true);
    }
  };

  // onInputTextChange
  const onInputTextChange = (e) => {
    setSearchValue(e.target.value)
  }

  // qui i lifecycle methods

  // render () {
  return (
    <div className="App">
      <div className="App-header">
        <Logo
          loading={isLoaded}
        />
        <input
          type="search"
          id="search" name="search"
          placeholder="Enter keyword here"
          onChange={onInputTextChange}
        />
        <button
          className="Search-Button"
          onClick={getJokeByKeyword}
        >
          <code>CLICK TO SEARCH!</code>
        </button>
        <code>or: </code>
        <CategoriesList
          categories={categories}
          onCategoryClick={onCategoryClick}
        />
      </div>
      <div className="Content">
        <img
          src="https://api.chucknorris.io/img/chucknorris_logo_coloured_small@2x.png"
          className="Chuck-Logo"
          alt="chuck-logo"
        />
        <code>
          <h2>
            SELECTED CATEGORY:
              <span className="Selected-Cat">
              {selectedTagState === "" ? "None" : selectedTagState}
            </span>
          </h2>
        </code>
        <button
          className="Random-Button"

        >
          <h2>GET RANDOM JOKE FOR SELECTED CATEGORY</h2>
        </button>
        {jokeByKw !== "" ? <Joke
          value={jokeByKw.value === undefined ? jokeByKw : jokeByKw.value}
          categories={jokeByKw.categories !== undefined && jokeByKw.categories[0]}
        /> : null}
      </div>
      <div className="footer">
        <code>Esame di React per cfp-futura. Grazie ad <a href="https://api.chucknorris.io">api.chucknorris.io</a> per l'immagine e le api. Docente: Vito Vitale. Studente: Giuseppe Ilsami</code>
      </div>
    </div>
  );
  // }
};

export default App;
