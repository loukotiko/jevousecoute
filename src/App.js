import React from 'react';
import './App.css';

import { Textfit } from 'react-textfit'

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      usedWords : [],
      allWords: []
    }
    
    this.newGame = this.newGame.bind(this)
    this.nextWord = this.nextWord.bind(this)
    this.endGame = this.endGame.bind(this)

    // Get a reference to the database service
    // Initialize Cloud Firestore through Firebase
    var database = window.firestore;
    this.words = database.collection('words').get().then((querySnapshot) => {
      console.log(querySnapshot)
      this.setState({
        allWords: querySnapshot.docs.map(doc => doc.data().variants)
      })
    })
  }
  
  newGame() {
    this.setState({
      availableWords: shuffle([...this.state.allWords]),
      usedWords: [],
      ended: false,
      started: false
    }, () => this.nextWord() )
  }
  
  nextWord() {
    const word = this.state.availableWords.pop();
    
    if(!word) return this.endGame()
    
    this.state.usedWords.push({word, found: false});
    
    this.setState({
      started: true,
      currentWord: word,
      usedWords: this.state.usedWords
    });
  }
  
  endGame() {
    this.setState({
      ended: true
    })
  }
  
  render() {
    const HomePage = ( 
      <Textfit mode="multi" className="word" onClick={ this.newGame }>Je vous écoute !</Textfit>
    )

    const WordPage = (
      <Textfit mode="multi" className="word" onClick={ this.nextWord }>
        { this.state.currentWord && this.state.currentWord.map((word, i) => (<div key={i}>{ word }</div>)) }
      </Textfit>
    )

    const WordListPage = (
      <ul className="words">
        { this.state.usedWords.map((entry, i) => (
          <li key={i}>
          { entry.word.map(
            (word, i) => ( <div key={i}>{ word }</div> )
          ) }
          </li>)
        ) }
      </ul>
    )

    const GamePage = (this.state.ended ? WordListPage : WordPage)
    
    const Nav = (
      <nav>
        <button onClick={ this.newGame }>Nouvelle partie</button>
        { !this.state.ended && <button onClick={ this.endGame }>Voir les mots</button> }
      </nav>
    )

    const Counter = ( <div className="count">{ this.state.usedWords.length }</div> )
   
    return ( !!this.state.allWords.length &&
      <div className="content">
        { this.state.started
          ? <div>
              { GamePage }
              { Counter }
              { Nav }
            </div>
          : HomePage
        }
      </div>
    );
  }
}

export default App;
