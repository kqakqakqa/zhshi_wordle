import file from '@system.file';

export default {
  data: {
    trials:[[{char:""},{char:""},{char:""},{char:""},{char:""}]],
    keys: [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Z','X','C','V','B','N','M']
    ],
    answer: [],
    keyboardHint: {},
    animationDuration: 0,
    animationInterval: null,
    animationFactor: 0,
    message: "",
    finished: false,
    refresh: true,
  },
  onInit() {
    // if()
    this.setAnswer();
  },
  onKeyPress(v){
    if(this.finished) return;
    const trialCount = this.trials.length - 1;
    this.trials[trialCount] = this.trials[trialCount]
      .filter(function(v){return v.char !== "";})
      .concat([{char:v.toString()},{char:""},{char:""},{char:""},{char:""}])
      .slice(0,5);
    this.refreshTrials();
  },
  onDelPress(){
    if(this.finished) return;
    const trialCount = this.trials.length - 1;
    this.trials[trialCount] = this.trials[trialCount]
      .filter(function(v){return v.char !== "";})
      .slice(0,-1)
      .concat([{char:""},{char:""},{char:""},{char:""},{char:""}])
      .slice(0,5);
    this.refreshTrials();
  },
  // setAnswer(){
  //   let i = 0;
  //   let wordIndex = 0;
  //   const targetIndex = Math.floor(1919 * this.getDailyRnd());
  //   // const targetIndex = Math.floor(1918 * Math.random());
  //
  //   while (i < this.wordsStr.length) {
  //     while (i < this.wordsStr.length && this.wordsStr[i] === ' ') i++;
  //     if (i >= this.wordsStr.length) break;
  //
  //     const prefix = this.wordsStr[i] + this.wordsStr[i + 1];
  //     i += 2;
  //
  //     while (i + 2 < this.wordsStr.length && this.wordsStr[i] !== ' ') {
  //       if (wordIndex === targetIndex) {
  //         this.answer = (prefix + this.wordsStr[i] + this.wordsStr[i + 1] + this.wordsStr[i + 2]).split("");
  //         return;
  //       }
  //       wordIndex++;
  //       i += 3;
  //     }
  //   }
  // },
  setAnswer(){
    let targetIndex = Math.floor(1919 * this.getDailyRnd());
    let i = 0;
    file.readText({
      uri: `internal://app/words/dict`,
      success: data => {
        const dict = JSON.parse(data.text);
        for (const key in dict) {
          const freq = dict[key];
          if (targetIndex < freq) {
            file.readText({
              uri: `internal://app/words/${key}`,
              position: targetIndex * 3,
              length: 3,
              success: data => {
                this.answer = (key + data.text).split("");
              }
            });
            return;
          }
          targetIndex -= freq;
        }
      },
    });

  },
  // isValid(trial){
  //   if(trial[4] === "") return false;
  //
  //   let i = 0;
  //
  //   while (i < this.wordsStr.length) {
  //     while (i < this.wordsStr.length && this.wordsStr[i] === ' ') i++;
  //     if (i >= this.wordsStr.length) break;
  //
  //     var prefix = this.wordsStr[i] + this.wordsStr[i + 1];
  //     i += 2;
  //
  //     if (prefix !== trial[0].char + trial[1].char) {
  //       while (i < this.wordsStr.length && this.wordsStr[i] !== ' ') i++;
  //       continue;
  //     }
  //
  //     while (i + 2 < this.wordsStr.length && this.wordsStr[i] !== ' ') {
  //       var word = prefix + this.wordsStr[i] + this.wordsStr[i + 1] + this.wordsStr[i + 2];
  //       if (word === trial[0].char + trial[1].char + trial[2].char + trial[3].char +trial[4].char) {
  //         return true;
  //       }
  //       i += 3;
  //     }
  //   }
  //
  //   return false;
  // },
  checkValid(trial, callbackfn){
    if(trial[4].char === "") callbackfn(false);

    file.readText({
      uri: `internal://app/words/${trial[0].char + trial[1].char}`,
      success: data => {
        callbackfn(data.text.indexOf(trial[2].char + trial[3].char + trial[4].char) !== -1);
      },
      fail: data => {
        callbackfn(false);
      }
    });
  },
  isCorrect(trial){
    return trial[0].char + trial[1].char + trial[2].char + trial[3].char + trial[4].char === this.answer.join("");
  },
  onEnterPress(){
    if(this.finished) return this.setAnimation();
    const trialCount = this.trials.length - 1
    const trial = this.trials[trialCount];
    this.checkValid(trial,isValid=>{
      if(!isValid) {
        this.message = "Invalid word"
        this.setAnimation();
        this.refreshTrials();
        return;
      }
      this.trials[trialCount] = this.getHint(trial,this.answer);
      this.keyboardHint = this.getKeyboardHint(this.trials);
      if(this.isCorrect(trial)){
        this.message = "Splendid!";
        this.setAnimation();
        this.finished = true;
        this.refreshTrials();
        return;
      }
      if(trialCount>4){
        this.finished = true;
        this.message = this.answer.join("");
        this.refreshTrials();
        return;
      }
      this.trials.push([{char:""},{char:""},{char:""},{char:""},{char:""}]);
    });
  },
  refreshTrials(){
    this.refresh = false;
    this.refresh = true;
  },
  flat1(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (Array.isArray(item)) {
        for (var j = 0; j < item.length; j++) {
          result.push(item[j]);
        }
      } else {
        result.push(item);
      }
    }
    return result;
  },
  getDailyRnd(time = Date.now()) {
    const date = new Date(time + 8 * 60 * 60 * 1000);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const seed =year * 10000 + month * 100 + day;
    const a = 9301;
    const c = 49297;
    const m = 233280;
    return (seed * a + c) % m / m;
  },
  getHint(trial, answer) {
    const answerUsed = [false,false,false,false,false];

    for (let i = 0; i < 5; i++) {
      if (trial[i].char === answer[i]) {
        trial[i].hint = "green";
        answerUsed[i] = true;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (trial[i].hint === undefined) trial[i].hint = "gray";
      else if (trial[i].hint !== "gray") continue;

      for (let j = 0; j < 5; j++) {
        if (!answerUsed[j] && trial[i].char === answer[j]) {
          trial[i].hint = "yellow";
          answerUsed[j] = true;
          break;
        }
      }
    }

    return trial;
  },
  getKeyboardHint(trials) {
    const priority = { gray: 0, yellow: 1, green: 2 };
    const keyboardHint = {};

    const trialsFlat = this.flat1(trials);

    for (let i = 0; i < trialsFlat.length; i++) {
      const char = trialsFlat[i].char;
      const color = trialsFlat[i].hint;

      if (!keyboardHint[char] || priority[color] > priority[keyboardHint[char]]) {
        keyboardHint[char] = color;
      }
    }

    return keyboardHint;
  },
  setAnimation() {
    this.animationDuration = this.animationDuration % 15 + 15;
    if (!this.animationInterval) {
      this.animationInterval = setInterval( function(self) {
        const x = self.animationDuration / 15;
        self.animationFactor = Math.sin(x * 6 * Math.PI) * Math.atan(x * 2) ** 2;
        if (self.animationDuration < 1) {
          clearInterval(self.animationInterval);
          self.animationInterval = null;
          return;
        }
        self.animationDuration -= 1;
      }, 500/15 ,this);
    }
  },
  getHintColor(str){
    switch (str) {
      case "green": return "#595";
      case "yellow": return "#ba3";
      case "gray": return "#777";
      default: return "#444";
    }
  },
  getHintBgColor(str){
    switch (str) {
      case "green": return "#595";
      case "yellow": return "#ba3";
      case "gray": return "#777";
      default: return "transparent";
    }
  },
  getKeyboardHintColor(key){
    return this.getHintColor(this.keyboardHint[key]);
  }
}