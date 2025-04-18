import { Calculator as CalculatorIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export function Calculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const { isDarkMode } = useTheme();

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (firstOperand === null || operator === null) {
      return inputValue;
    }

    let result = 0;
    switch (operator) {
      case '+':
        result = firstOperand + inputValue;
        break;
      case '-':
        result = firstOperand - inputValue;
        break;
      case '*':
        result = firstOperand * inputValue;
        break;
      case '/':
        result = firstOperand / inputValue;
        break;
      default:
        return inputValue;
    }

    return Number(result.toFixed(8));
  };

  const handleEquals = () => {
    if (!operator || firstOperand === null) return;

    const result = performCalculation();
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        <CalculatorIcon size={24} />
      </button>

      {isOpen && (
        <div className={`absolute top-12 right-0 p-4 rounded-lg shadow-lg w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Calculadora</h3>
            <button
              onClick={() => setIsOpen(false)}
              className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <X size={20} />
            </button>
          </div>

          <div className={`p-3 rounded mb-4 text-right text-2xl font-mono ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {display}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={clearDisplay}
              className="col-span-2 p-3 bg-red-600 text-white rounded hover:bg-red-700"
            >
              AC
            </button>
            <button
              onClick={() => handleOperator('/')}
              className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ÷
            </button>
            <button
              onClick={() => handleOperator('*')}
              className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ×
            </button>

            {['7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => inputDigit(num)}
                className={`p-3 rounded hover:bg-opacity-80 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperator('-')}
              className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              -
            </button>

            {['4', '5', '6'].map((num) => (
              <button
                key={num}
                onClick={() => inputDigit(num)}
                className={`p-3 rounded hover:bg-opacity-80 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleOperator('+')}
              className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              +
            </button>

            {['1', '2', '3'].map((num) => (
              <button
                key={num}
                onClick={() => inputDigit(num)}
                className={`p-3 rounded hover:bg-opacity-80 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleEquals}
              className="row-span-2 p-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              =
            </button>

            <button
              onClick={() => inputDigit('0')}
              className={`col-span-2 p-3 rounded hover:bg-opacity-80 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className={`p-3 rounded hover:bg-opacity-80 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              .
            </button>
          </div>
        </div>
      )}
    </div>
  );
}