"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const produtos = [
    {
        id: 1,
        nome: 'Placa-mãe',
        preco: 499.99
    },
    {
        id: 2,
        nome: 'Memória RAM',
        preco: 229.99
    },
    {
        id: 3,
        nome: 'Procesador',
        preco: 539.99
    }
];
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
app.get('/produtos', (req, res) => {
    res.status(200).json(produtos);
});
//# sourceMappingURL=app.js.map