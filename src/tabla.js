    import React, { useState } from "react";
    import "./tabla.css";

    const parserTable = {
    E_delete: ["delete", "D"],
    D_from: ["from", "I", "O"],
    I_alpha: ["L", "R"],
    L_alpha: ["alpha"],
    R_alpha: ["L", "R"],
    R_where: ["epsilon"],
    "R_'": ["epsilon"],
    R_$: ["epsilon"],
    "R_=": ["epsilon"],
    O_where: ["where", "C"],
    O_$: ["epsilon"],
    C_alpha: ["I", "=", "V"],
    V_digit: ["D", "RE"],
    "V_'": ["'", "I", "'"],
    RE_digit: ["D", "RE"],
    RE_$: ["epsilon"],
    D_digit: ["digit"],
    };

    const terminales = new Set(
    Object.keys(parserTable).map((key) => key.split("_")[1])
    );
    const palabrasReservadas = ["delete", "from", "where"];

    const organizador = (palabras) => {
    const simbolos = [];
    palabras.forEach((palabra) => {
        if (palabrasReservadas.includes(palabra)) {
        simbolos.push(palabra);
        } else {
        palabra.split("").forEach((letra) => {
            if (/[a-zA-Z]/.test(letra)) {
            simbolos.push("alpha");
            } else if (/[0-9]/.test(letra)) {
            simbolos.push("digit");
            } else {
            simbolos.push(letra);
            }
        });
        }
    });
    return simbolos;
    };

    const analizadorSintactico = (entrada) => {
    const stack = ["$", "E"];
    let text = `${String(stack)}\n`;
    let index = 0;

    const palabras = entrada.trim().split(" ");
    const simbolos = organizador(palabras);

    while (true) {
        const X = stack.pop();
        const a = simbolos[index];

        if (X === "$") {
        if (a === "$" || typeof a === "undefined") {
            return text;
        } else {
            return `${text}\nError de sintaxis: se esperaba fin de cadena pero se encontró '${a}'`;
        }
        }

        if (terminales.has(X)) {
        if (X === a) {
            index++;
            text += `${String(stack)}\n`;
        } else {
            return `${text}\nError de sintaxis: se esperaba '${X}' pero se encontró '${a}'`;
        }
        } else {
        const key = `${X}_${a}`;
        if (parserTable.hasOwnProperty(key)) {
            const producciones = parserTable[key];
            if (producciones[0] !== "epsilon") {
            producciones
                .slice()
                .reverse()
                .forEach((produccion) => {
                stack.push(produccion);
                });
            }
            text += `${String(stack)}\n`;
        } else {
            if (X === "RE" && typeof a === "undefined") {
            return text;
            }
            return `${text}\nError de sintaxis: no hay una producción definida para '${X}' con '${
            simbolos.length <= index ? "undefined" : a
            }'`;
        }
        }
    }
    };

    const App = () => {
    const [entrada, setEntrada] = useState("");
    const [resultado, setResultado] = useState("");

    const handleInputChange = (event) => {
        setEntrada(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const resultadoAnalisis = analizadorSintactico(entrada);
        setResultado(resultadoAnalisis);
    };

    return (
        <div className="container">
        <div>
            <h1>Analizador Sintáctico</h1>
            <form onSubmit={handleSubmit}>
            <textarea
                className="code-input"
                value={entrada}
                onChange={handleInputChange}
                placeholder="Ingresa tu código aquí..."
            />
            <button className="button" type="submit">
                Analizar
            </button>
            </form>
        </div>
        <div className="result-container">
            <h2>Resultado:</h2>
            <pre>{resultado}</pre>
        </div>
        </div>
    );
    };

    export default App;
