import OptionsGame from '../options/options-game';

class Utils {
  private static randomNum = (num: number) => {
    const random = Math.floor(Math.random() * num);
    return random;
  };

  private static randomValue = () => {
    const random = Math.floor(Math.random() * 101);
    return random >= 90 ? 4 : 2;
  };

  private static randomCoordinates = (
    variantsArray: number[],
    randomNum: number,
  ) => {
    const index = variantsArray[randomNum];
    const y = Math.floor(Math.abs(index / 5));
    const x = index - y * 5;

    return [x, y];
  };

  static identifyBlankCells = (field: number[][]) => {
    return field.flat().reduce((arr: number[], item, index) => {
      if (item === 0) arr.push(index);
      return arr;
    }, []);
  };

  static dataForRandomCell = (variants: number[]) => {
    const randomIndex = Utils.randomNum(variants.length);
    const [x, y] = Utils.randomCoordinates(variants, randomIndex);
    const randomValue = Utils.randomValue();

    return { randomValue, x, y };
  };

  static calculateFontSize = (baseFontSize: number, num: number) => {
    const numLength = num.toString().length;
    const fontSize =
      numLength === 1 ? baseFontSize : baseFontSize - numLength * 5;

    return fontSize < 14 ? 14 : fontSize;
  };

  static playSound(filename: string) {
    if (OptionsGame.sound) {
      const sound = new Audio(`./audio/${filename}.mp3`);
      sound.play();
    }
  }

  static removeAllElements = (parentElem: HTMLElement, className: string) => {
    parentElem
      .querySelectorAll(`.${className}`)
      .forEach((item) => item.remove());
  };
}

export default Utils;
