const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/projeto_escolar')

.then(() => console.log(">>> MONGODB CONECTADO COM SUCESSO <<<")) // Mudei a msg para destacar
.catch(err => console.error("ERRO AO CONECTAR NO MONGO:", err));

// 2. Definição dos Models (Collections e Relacionamento)

// Collection 1: Categoria
const CategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: String
});
const Categoria = mongoose.model('Categoria', CategoriaSchema);

// Collection 2: Produto (Relacionado com Categoria)
const ProdutoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true } // Relacionamento
});
const Produto = mongoose.model('Produto', ProdutoSchema);

// 3. Rotas da API
app.post('/categorias', async (req, res) => {
    try {
        console.log("Dados recebidos:", req.body); // Isso vai mostrar o que chegou
        const categoria = await Categoria.create(req.body);
        res.json(categoria);
    } catch (error) {
        console.error("ERRO AO SALVAR:", error); // Isso mostra o erro no terminal
        res.status(500).json({ error: error.message });
    }
});

app.get('/categorias', async (req, res) => {
    const categorias = await Categoria.find();
    res.json(categorias);
});

// --- Rotas de Produtos ---
app.post('/produtos', async (req, res) => {
    try {
        const produto = await Produto.create(req.body);
        res.json(produto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/produtos', async (req, res) => {
    // .populate() preenche os dados da categoria em vez de mostrar só o ID
    const produtos = await Produto.find().populate('categoria');
    res.json(produtos);
});

app.put('/produtos/:id', async (req, res) => {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(produto);
});

app.delete('/produtos/:id', async (req, res) => {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto deletado' });
});

// Iniciar Servidor
app.listen(3001, () => console.log('Servidor rodando na porta 3001'));