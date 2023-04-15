const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()

// middle ware 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.az1id2r.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        client.connect();
        const productCollection = client.db('emaJohn').collection('product');

        app.get('/products', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }
            res.send(products)

        })

        app.get('/productCount', async (req, res) => {

            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        });
        // use post to get products by ids
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => new ObjectId(id))
            const query = { _id: { $in: keys } }
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log(keys);
            res.send(products)
        }

        )

    }

    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send(' ema john running');
})

app.listen(port, () => {
    console.log(port);
})