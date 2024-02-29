import React, { useState } from 'react';

const parserTable = {
  'E_delete': ['delete', 'D'],
  'D_from': ['from', 'I', 'O'],
  'I_alpha': ['L', 'R'],
  'L_alpha': ['alpha'],
  'R_alpha': ['L', 'R'],
  'R_where': ['epsilon'],
  "R_'": ['epsilon'],
  'R_$': ['epsilon'],
  'R_=': ['epsilon'],
  'O_where': ['where', 'C'],
  'O_$': ['epsilon'],
  'C_alpha': ['I', '=', 'V'],
  'V_digit': ['D', 'RE'],
  "V_'": ["'", 'I', "'"],
  'RE_digit': ['D', 'RE'],
  'RE_$': ['epsilon'],
  'D_digit': ['digit']
};

const terminales = new Set(Object.keys(parserTable).map(key => key.split('_')[1]));
const palabrasReservadas = ['delete', 'from', 'where'];

function organizador(palabras) {
  const simbolos = [];
  palabras.forEach(palabra => {
    if (palabrasReservadas.includes(palabra)) {
      simbolos.push(palabra);
    } else {
      palabra.split('').forEach(letra => {
        if (/[a-zA-Z]/.test(letra)) {
          simbolos.push('alpha');
        } else if (/\d/.test(letra)) {
          simbolos.push('digit');
        } else {
          simbolos.push(letra);
        }
      });
    }
  });
  return simbolos;
}

function analizadorSintactico(entrada) {
  let stack = ['$', 'E'];
  let text = `${stack}\n`;
  entrada = entrada.trim() + ' $';
  const palabras = entrada.split(' ');
  const simbolos = organizador(palabras);
  let index = 0;
  while (true) {
    const X = stack.pop();
    const a = simbolos[index];
    if (terminales.has(X)) {
      if (X === a) {
        index++;
        text += `${stack}\n`;
        if (X === '$') {
          return text;
        }
      } else {
        return text + '\nError de sintaxis';
      }
    } else {
      const key = `${X}_${a}`;
      if (parserTable.hasOwnProperty(key)) {
        const producciones = parserTable[key];
        if (producciones[0] !== 'epsilon') {
          producciones.reverse().forEach(produccion => {
            stack.push(produccion);
          });
        }
        text += `${stack}\n`;
      } else {
        return text + '\nError de sintaxis';
      }
    }
  }
}

function Parser() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleParse = () => {
    const result = analizadorSintactico(input);
    setOutput(result);
  };

  return (
    <div>
      <textarea value={input} onChange={handleInputChange} rows={4} cols={50} />
      <button onClick={handleParse}>Parse</button>
      <div>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default Parser;
