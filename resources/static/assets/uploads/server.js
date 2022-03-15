import express from 'express'
import chalk from 'chalk';

const app = express();

app.use(express.json());

const books = [
    { "_id": "123456", "title": "The 7 habits of highly effective people", "publisher": "Someone", "rating": "⭐⭐⭐⭐⭐" },
    { "_id": "789456", "title": "Deep Work", "publisher": "Someone else", "rating": "⭐⭐⭐⭐" },
    { "_id": "456123", "title": "Show your work", "publisher": "Another guy", "rating": "⭐⭐⭐" }


]

// middlewawres

const middleware1 = (req, res, next) => {
    console.log('Im a middleware 🥶 ')
    // console.log('Im a middleware 🥶 i will happen before reaching the endpoint')
    next();
}

const loggerMiddleware = (req, res, next) => {
    console.log(chalk.black.bgWhite(req.method), chalk.red.bgWhite(req.path), chalk.blue.bgWhite(new Date()))
    next();
}

// app.use(middleware1);
app.use(loggerMiddleware);

app.get('/', (req, res) => {
    return res.redirect('/')
})


app.get('/books', (req, res) => {
    return res.send(books)
})

app.post('/books', (req, res) => {
    const newBook = { "_id": "102030", "title": "The 4 hour work week", "publisher": "Another man", "rating": "⭐⭐⭐" }
    // const newBook = req.body;
    // if (!newBook) return res.status(401).send('Bad Request')
    books.push(newBook);
    return res.status(201).send(books);
})

app.get('/books/:id', (req, res) => {
    const currBook = books.find(book => book._id === req.params.id);
    if (!currBook) return res.status(404).send(`Not Found with the ID of ${req.params.id}`)
    return res.status(200).send(currBook);
})


app.put('/books/:id', (req, res) => {
    let currentBook = books.find(book => book._id === req.params.id);
    if (!currentBook) return res.status(404).send(`Not Found with the ID of ${req.params.id}`)
    const updBook = req.body;

    if (!updBook._id || !updBook.title || !updBook.publisher) return res.status(401)

    currentBook._id = updBook._id
    currentBook.title = updBook.title
    currentBook.publisher = updBook.publisher
    currentBook.rating = updBook.rating

    return res.status(201).send(books);
})

app.delete('/books/:id', (req, res) => {
    const currBook = books.find(book => book._id === req.params.id);
    if (!currBook) return res.status(404).send(`Not Found with the ID of ${req.params.id}`)
    books.pop(currBook);
    res.status(200).send(books);
})



const port = 8000;
const address = 'localhost';


app.listen(port, () => { console.log(`Server running on http://${address}:${port}`) });
