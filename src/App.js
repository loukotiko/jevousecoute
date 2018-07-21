import React from 'react';
import './App.css';

import { Textfit } from 'react-textfit'

import allWords from './words'

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
    
    this.state = {}
    
    this.newGame = this.newGame.bind(this)
    this.nextWord = this.nextWord.bind(this)
    this.endGame = this.endGame.bind(this)
  }
  
  componentDidMount() {
    this.newGame()
  }
  
  newGame() {
    this.setState({
      availableWords: shuffle([...allWords]),
      currentWord: 'Je vous écoute',
      usedWords: [],
      ended: false,
      started: false
    });
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

    return (
      <div className="content">
        { this.state.ended
          ? <ul className="words">
              { this.state.usedWords.map((entry, i) => (<li key={i}>{ entry.word }</li>)) }
            </ul>
          : <Textfit mode="multiple" className="word" onClick={ this.nextWord }>
              { this.state.currentWord && this.state.currentWord.split(' || ').map(word => (<div>{ word }</div>)) }
            </Textfit>
        }
        
        { this.state.started && <div className="count">{ this.state.usedWords.length }</div> }
        
        <nav>
          { this.state.started && <button onClick={ this.newGame }>Nouvelle partie</button> }
          { this.state.started && !this.state.ended && <button onClick={ this.endGame }>Voir les mots</button> }
        </nav>
      </div>
    );
  }
}

export default App;
