const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3006;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'usu',
    password: 'passusu',
    database: 'dev2blu'
});

db.connect(err => {
    if(err){
        console.log('Erro ao conectar ao banco de dados: ', err);
        return;
    }
    console.log('conectado ao banco de dados MySQL.')
});

app.listen(port, () => {
    console.log('servidor rodando na porta ' + port)
});

app.post('/usuarios', (req,res) => {
    const { nomeusuario, emailusuario, idadeusuario} = req.body;

    const query  = 
    'INSERT INTO usuario (nomeusuario, emailusuario, idadeusuario) ' +
    'VALUES (?, ?, ? )';


db.query(query,
    [nomeusuario, emailusuario, idadeusuario],
    (err, result) =>{
        if(err) {
            console.error(err);
            res.status(500).send('Erro ao inserir o usuario');
            return;
        }
        res.status(201).send('Usuario criado com ID: ' + result.insertId);
    }
);
});

app.get('/usuarios', (req,res) => {
    const query = 'SELECT * FROM usuario';

    db.query(query, (err,results) =>{
        if(err){
            console.error(err);
            res.status(500).send('Erro ao buscar os usuarios.');
            return;
        }
        res.status(200).json(results);
    });
});

app.get('/usuarios/:id' , (req, res) => {
    const {id} = req.params;
    const query = 'SELECT * FROM usuario WHERE idusuario = ?';

    db.query(query,[id], (err,results) =>{
        if(err){
            console.errror(err);
            res.status(500).send('Erro ao buscar o usuario');
            return;
        }
        if(results.length === 0){
            res.status(404).send('Usuario não encontrado.');
            return;
        }
        res.status(200).json(results[0]);
    });
});

app.put('/usuarios/:id', (req,res) =>{
    const {id} = req.params;
    const {nomeusuario,emailusuario,idadeusuario} = req.body;

    const query =
    'UPDATE usuario SET nomeusuario = ?, emailusuario = ?, idadeusuario = ? ' +
    'WHERE idusuario = ?';

    db.query(query,
        [nomeusuario, emailusuario, idadeusuario,id],
        (err,result) => {
            if(err) {
                console.error(err);
                res.status(500).send('Erro ao atulizar o usuario.');
                return;
            }
            if (result.affectedRows === 0){
                res.status(404).send('Usuario não encontrado.');
                return;
            }
            res.status(200).send('Usuario com ID: ' + id + 'atualizado');
        });
});
app.delete('/usuarios/:id', (req,res) =>{
    const {id} = req.params;
    const query = 'DELETE FROM usuario WHERE idusuario = ?';

    db.query(query, [id], (err,result) => {
        if(err){
            console.error(err);
            res.status(500).send('erro ao excluir o usuario.');
            return;
        }
        if(result.affectedRows === 0){
            res.status(404).send('Usuario não encontrado');
            return;
        }
        res.status(200).send('Usuario com ID: ' + id + ' excluido');
    });
});