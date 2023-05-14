const express = require('express');
const exphbs = require('express-handlebars')
const pool = require('./db/conn')
const app = express();


app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pageqty = req.body.pageqty
    const descricao = req.body.descricao
    const nota = req.body.nota
    const data = req.body.data

    const sql = `INSERT INTO books (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)`
    const result =  ['title', 'pageqty', 'descricao', 'nota', 'data', title, pageqty, descricao, nota, data];



    pool.query(sql, result, function(err){
        if(err){
            console.log(err)
            return
        }

        res.redirect('/')
    })
})

app.get('/saibamais', (req, res) => {

    const title = req.body.title

    res.redirect(`https://openlibrary.org/books/OL7353617M/${title}`)
})

app.get('/books', (req, res) => {
    const sqlBooks = "SELECT * FROM books";
    const sqlTotal = "SELECT SUM(pageqty) AS total FROM books";
  
    pool.query(sqlBooks, function(err, data){
      if(err){
        console.log(err);
        return;
      }
  
      const books = data;
  
      pool.query(sqlTotal, function(err, results){
        if(err){
          console.log(err);
          return;
        }
  
        const valor = results[0].total;
  
        res.render('books', { books, valor });
      });
    });
  });

app.get('/books/:id', (req, res) => {
    
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id = ${id}`

    pool.query(sql, function(err ,data){
        if(err){
            console.log(err)
        }

        const book = data[0]

        res.render('book', {book})


    })

}) 

app.get('/books/edit/:id', (req, res) => {

    const id = req.params.id;

    const sql = `SELECT * FROM books WHERE id = ${id}`;

    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const book = data[0]

        res.render('editbook', {book})
    })

})

app.post('/books/updatebook', (req, res) => {
    
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty
    const descricao = req.body.descricao
    const nota = req.body.nota

    const sql = `UPDATE books SET title = '${title}', pageqty = '${pageqty}', descricao = '${descricao}', nota = '${nota}' WHERE id = ${id}`

    pool.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')

    })

})

app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const sql = `DELETE FROM books WHERE id = ${id}`

    pool.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }
    })

    res.redirect('/books')


})

app.get('/', (req, res) => {
    res.render('home')
})



app.listen(3000, () => {
    console.log("Servidor rodando na porta 5001")
})
