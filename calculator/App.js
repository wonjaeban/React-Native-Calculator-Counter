import { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

class AllButton extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.title != nextProps.title;
  }

  render() {
    const mathSigns = ['()', '%', '/', 'X', '-', '+'];
    if (this.props.title === '=') {
      return (
        <TouchableOpacity
          style={styles.roundButtonEqual}
          onPress={this.props.onClick}
        >
          <Text style={styles.textButtons}>{this.props.title}</Text>
        </TouchableOpacity>
      );
    } else if (mathSigns.includes(this.props.title)) {
      return (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => {
            this.props.onClick(this.props.title);
          }}
        >
          <Text style={styles.textButtonSign}>{this.props.title}</Text>
        </TouchableOpacity>
      );
    } else if (this.props.title === 'AC') {
      return (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => {
            this.props.onClick(this.props.title);
          }}
        >
          <Text style={styles.textButtonAC}>{this.props.title}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => this.props.onClick(this.props.title)}
      >
        <Text style={styles.textButtons}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '0',
    };
  }

  //최종적으로 화면에 있는 문자 및 숫자들을 계산하는 함수
  makeResult = () => {
    const basicMathSigns = ['/', 'X', '-', '+'];
    const numberAndSigns = this.state.number;
    //현재 화면에 나온 문자들의 마지막이 기호로 끝난다면
    if (basicMathSigns.includes(numberAndSigns[this.state.number.length - 1])) {
      alert('완성되지 않은 수식입니다!');
      return;
    }
    //화면의 숫자들을 기호들을 기준으로 쪼갭니다.
    const stringNumbers = numberAndSigns.split(/[+, \-, X, /]/);
    for (let i = 0; i < stringNumbers.length; i++) {
      //기호들을 기준으로 쪼갠후에 숫자뒤에 %가 붙어있다면 실수로 바꿔줍니다.
      if (stringNumbers[i].includes('%')) {
        let percentNumber = stringNumbers[i].slice(0, -1);
        stringNumbers.splice(i, 1, Number(percentNumber) / 100);
      }
    }
    const numbers = stringNumbers.map((each) => Number(each));
    let signs = [];
    let newSigns = [];
    let i = 0;
    let decreaseIndex = 0;
    let result = 0;

    for (i = 0; i < numberAndSigns.length; i++) {
      if (basicMathSigns.includes(numberAndSigns[i])) {
        signs.push(numberAndSigns[i]);
      }
    }

    for (i = 0; i < signs.length; i++) {
      //나누기는 우선순위상 먼저 계산합니다.
      if (signs[i] === '/') {
        let intermediateResult =
          numbers[i - decreaseIndex] / numbers[i - decreaseIndex + 1];
        numbers.splice(i - decreaseIndex, 2);
        numbers.splice(i - decreaseIndex, 0, intermediateResult);
        decreaseIndex++;
        continue;
      } //곱하기는 우선순위상 먼저 계산합니다.
      else if (signs[i] === 'X') {
        let intermediateResult =
          numbers[i - decreaseIndex] * numbers[i - decreaseIndex + 1];
        numbers.splice(i - decreaseIndex, 2);
        numbers.splice(i - decreaseIndex, 0, intermediateResult);
        decreaseIndex++;
        continue;
      }
      newSigns.push(signs[i]);
    }

    result = numbers[0];
    for (i = 0; i < newSigns.length; i++) {
      //빼기를 계산합니다.
      if (newSigns[i] === '-') {
        result = result - numbers[i + 1];
      } //더하기를 계산합니다.
      else if (newSigns[i] === '+') {
        result = result + numbers[i + 1];
      }
    }
    this.setState({
      number: result.toString(),
    });
  };

  checkPastDots = () => {
    let length = this.state.number.length;
    let nowNumber = this.state.number;
    let index = length - 1;
    const pastMathSigns = [')', '%', '/', 'X', '-', '+'];
    while (1) {
      // 이전에 .이 한번도 없었다면
      if (index === -1 || pastMathSigns.includes(nowNumber[index])) {
        this.setState({
          number: nowNumber + '.',
        });
        return;
      } //.이 있는데 또 . 찍으려는 경우니깐 무시합니다.
      else if (nowNumber[index] === '.') {
        return;
      }
      index--;
    }
  };

  makeDot = () => {
    const dotNextPositionSigns = ['.', '(', ')', '%', '/', 'X', '-', '+'];
    let nowNumber = this.state.number;
    let length = this.state.number.length;
    if (dotNextPositionSigns.includes(nowNumber[length - 1])) {
      return;
    } else if (nowNumber === '0') {
      this.setState({
        number: '0.',
      });
      return;
    }
    this.checkPastDots();
  };

  makeZero = () => {
    let length = this.state.number.length;
    let i = length - 1;
    let isActualNumber = false;
    const basicMathSigns = ['/', 'X', '-', '+'];
    const naturalNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let nowNumber = this.state.number;
    //기호뒤에는 0 가능
    if (basicMathSigns.includes(nowNumber[length - 1])) {
      this.setState({
        number: nowNumber + '0',
      });
      return;
    }
    while (1) {
      //기호를 만나거나 인덱스를 벗어나면 반복문을 끝낸다.
      if (i === 0 || basicMathSigns.includes(nowNumber[i])) {
        break;
      } //.을 만나면 소수다.
      else if (nowNumber[i] === '.') {
        isActualNumber = true;
        break;
      }
      i--;
    }
    // 기호를 만나거나 인덱스를 벗어나기 전까지 가장 첫번째 요소가 1~9 사이라면 2000000이 가능해야한다.
    if (
      naturalNumbers.includes(nowNumber[i]) ||
      naturalNumbers.includes(nowNumber[i + 1])
    ) {
      this.setState({
        number: nowNumber + '0',
      });
      return;
    }
    //실수아니면 0000불가능.
    if (!isActualNumber) {
      return;
    }
    this.setState({
      number: nowNumber + '0',
    });
  };

  makeNaturalNumbers = (val) => {
    let nowNumber = this.state.number;
    let length = this.state.number.length;
    const basicMathSigns = ['/', 'X', '-', '+'];
    if (nowNumber === '0') {
      this.setState({
        number: val,
      });
      return;
    } else if (
      nowNumber[length - 1] === '0' &&
      basicMathSigns.includes(nowNumber[length - 2])
    ) {
      let newNumber = '';
      for (let i = 0; i < length - 1; i++) {
        newNumber += nowNumber[i];
      }
      this.setState({
        number: newNumber + val,
      });
      return;
    } else if (nowNumber[length - 1] === '%') {
      this.setState({
        number: nowNumber + 'X' + val,
      });
      return;
    }
    this.setState({
      number: nowNumber + val,
    });
  };

  makeBasicMathSigns = (val) => {
    let nowNumber = this.state.number;
    let length = this.state.number.length;
    const basicMathSigns = ['/', 'X', '-', '+'];
    if (nowNumber[length - 1] === '(' || nowNumber[length - 1] === '.') {
      return;
    } else if (basicMathSigns.includes(nowNumber[length - 1])) {
      let newSentence = nowNumber.substring(0, length - 1);
      newSentence += val;
      this.setState({
        number: newSentence,
      });
      return;
    }
    this.setState({
      number: nowNumber + val,
    });
  };

  executeAC = () => {
    this.setState({
      number: '0',
    });
  };

  makePercent = (val) => {
    let nowNumber = this.state.number;
    let length = this.state.number.length;
    const dotNextPositionSigns = ['.', '(', ')', '%', '/', 'X', '-', '+'];

    if (!isNaN(parseInt(nowNumber[length - 1]))) {
      this.setState({
        number: nowNumber + val,
      });
      return;
    } else if (dotNextPositionSigns.includes(nowNumber[length - 1])) {
      alert('완성되지 수식입니다!');
      return;
    }
  };

  makeExpression = (val) => {
    const basicMathSigns = ['/', 'X', '-', '+'];

    if (val === '.') {
      this.makeDot();
    } else if (val === '0') {
      this.makeZero();
    } else if (!isNaN(parseInt(val))) {
      this.makeNaturalNumbers(val);
    } else if (basicMathSigns.includes(val)) {
      this.makeBasicMathSigns(val);
    } else if (val === 'AC') {
      this.executeAC();
    } else if (val === '%') {
      this.makePercent(val);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperPlace}>
          <Text style={styles.calculatedNumber}>{this.state.number}</Text>
        </View>
        <View style={styles.downPlace}>
          <View style={styles.buttons}>
            <AllButton title="AC" onClick={this.makeExpression}></AllButton>
            <AllButton title="()" onClick={this.makeExpression}></AllButton>
            <AllButton title="%" onClick={this.makeExpression}></AllButton>
            <AllButton title="/" onClick={this.makeExpression}></AllButton>
          </View>
          <View style={styles.buttons2}>
            <AllButton title="7" onClick={this.makeExpression}></AllButton>
            <AllButton title="8" onClick={this.makeExpression}></AllButton>
            <AllButton title="9" onClick={this.makeExpression}></AllButton>
            <AllButton title="X" onClick={this.makeExpression}></AllButton>
          </View>
          <View style={styles.buttons3}>
            <AllButton title="4" onClick={this.makeExpression}></AllButton>
            <AllButton title="5" onClick={this.makeExpression}></AllButton>
            <AllButton title="6" onClick={this.makeExpression}></AllButton>
            <AllButton title="-" onClick={this.makeExpression}></AllButton>
          </View>
          <View style={styles.buttons4}>
            <AllButton title="1" onClick={this.makeExpression}></AllButton>
            <AllButton title="2" onClick={this.makeExpression}></AllButton>
            <AllButton title="3" onClick={this.makeExpression}></AllButton>
            <AllButton title="+" onClick={this.makeExpression}></AllButton>
          </View>
          <View style={styles.buttons5}>
            <AllButton title="+/-" onClick={this.makeExpression}></AllButton>
            <AllButton title="0" onClick={this.makeExpression}></AllButton>
            <AllButton title="." onClick={this.makeExpression}></AllButton>
            <AllButton title="=" onClick={this.makeResult}></AllButton>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperPlace: {
    flex: 0.3,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  downPlace: {
    flex: 0.8,
    backgroundColor: 'black',
  },
  buttons: {
    flex: 0.1,
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 23,
  },
  buttons2: {
    flex: 0.1,
    flexDirection: 'row',
    marginTop: 70,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 23,
  },
  buttons3: {
    flex: 0.1,
    flexDirection: 'row',
    marginTop: 70,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 23,
  },
  buttons4: {
    flex: 0.1,
    flexDirection: 'row',
    marginTop: 70,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 23,
  },
  buttons5: {
    flex: 0.1,
    flexDirection: 'row',
    marginTop: 70,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 23,
  },
  calculatedNumber: {
    fontSize: 50,
  },
  roundButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#292929',
  },
  roundButtonEqual: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'green',
  },
  textButtons: {
    color: 'white',
    fontSize: 30,
  },
  textButtonSign: {
    color: 'green',
    fontSize: 30,
  },
  textButtonAC: {
    color: 'red',
    fontSize: 30,
  },
});

export default App;
