import Game from '../gaming-logic/Game';
import Rating from '../rating/Rating';
import OptionsGame from './options-game';

interface IOptions {
  parentElem: HTMLElement;
  playGame: Game | null;
  newGame: () => void;
}

class Options {
  private gameOptions: HTMLDivElement;
  private parentElem: HTMLElement;
  private playGame: Game | null = null;
  private newGame: () => void;

  constructor({ parentElem, playGame, newGame }: IOptions) {
    this.parentElem = parentElem;
    this.gameOptions = document.createElement('div');
    this.playGame = playGame;
    this.newGame = newGame;
    this.render();
    this.listener();
  }

  private render = () => {
    const { sound, isEndless, difficulty } = OptionsGame;
    const view = `
    <div  class="options">
      <div class="options__wrap">
        <button class="btn options__btn options__btn_step_back">Step back</button>
      </div>
     
      <h2 class="options__title title">Options</h2>
      <div class="options__wrap">
        <button class="btn options__btn options__btn_sound">${
          sound ? '🔊' : '🔈'
        }</button>
        <button class="btn options__btn options__btn_duration">${
          isEndless ? 'Endless' : '2048'
        }</button>
      </div>
      
      <h2 class="options__title title">Game difficulty</h2>
      <div class="options__wrap">
          <label class="options__label-difficulty btn" for="easy">1
          <input class="options__input-difficulty" type="radio" name="difficulty" id="easy" value="1" 
          ${difficulty === 1 && 'checked'}>
        </label>
        <label class="options__label-difficulty btn" for="medium">2
          <input class="options__input-difficulty" type="radio" name="difficulty" id="medium" value="2" 
          ${difficulty === 2 && 'checked'}>
        </label>
        <label class="options__label-difficulty btn" for="hard">3
         <input class="options__input-difficulty" type="radio" name="difficulty" id="hard" value="3" 
         ${difficulty === 3 && 'checked'}>
        </label>
      </div>
      
      <h2 class="options__title title">Ratings</h2>
      <div class="options__wrap">
        <button class="btn options__btn options__btn_rating_2048">2048</button>
        <button class="btn options__btn options__btn_rating_endless">Endless</button>
      </div>
    </div>
  `;

    this.gameOptions.className = 'game__options';
    this.gameOptions.innerHTML = view;
    this.parentElem.appendChild(this.gameOptions);
  };

  private listener = () => {
    this.gameOptions.addEventListener('click', this.clickHandler);
    this.gameOptions.addEventListener('change', this.changeHandler);
  };

  remove = () => {
    this.gameOptions.classList.remove('game__options_animate-add');
    this.gameOptions.classList.add('game__options_animate-remove');

    setTimeout(() => {
      this.gameOptions.remove();
      this.remove();
    }, 250);
  };

  private clickHandler = (e: MouseEvent) => {
    const target = <HTMLButtonElement>e.target;
    if (target) {
      if (target.classList.contains('options__btn_sound')) {
        this.changeSound(target);
      }
      if (target.classList.contains('options__btn_rating_2048')) {
        this.openRating('2048');
      }
      if (target.classList.contains('options__btn_rating_endless')) {
        this.openRating('Endless');
      }
      if (target.classList.contains('options__btn_duration')) {
        this.changeTypeGame(target);
      }
      if (target.classList.contains('options__btn_step_back')) {
        this.stepBack();
      }
    }
  };

  private changeSound = (btn: HTMLButtonElement) => {
    if (OptionsGame.sound) {
      btn.innerHTML = '🔈';
      OptionsGame.sound = false;
    } else {
      btn.innerHTML = '🔊';
      OptionsGame.sound = true;
    }
  };

  private changeTypeGame = (btn: HTMLButtonElement) => {
    if (OptionsGame.isEndless) {
      btn.innerHTML = '2048';
      OptionsGame.isEndless = false;
    } else {
      btn.innerHTML = 'Endless';
      OptionsGame.isEndless = true;
    }

    this.newGame();
  };

  private openRating = (variant: string) => {
    if (this.gameOptions) {
      new Rating(this.gameOptions, variant);
    }
  };

  private changeHandler = (e: Event) => {
    const target = <HTMLInputElement>e.target;
    OptionsGame.difficulty = +target.value;

    this.newGame();
  };

  private stepBack = () => {
    if (this.playGame) this.playGame.stepBack();
  };
}

export default Options;
