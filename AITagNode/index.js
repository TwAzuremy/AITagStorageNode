const express = require('express')
const path = require('path')
const app = express()
const url = require('url')
const mysql = require('mysql')

const db_config = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'tags'
}

app.use(express.static(path.join(__dirname, '/public')))
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
})

app.listen(8081, () => {
    console.log('App listening at port 8081, http://localhost:8081/')
})

// sql connect
const connect = mysql.createConnection(db_config)
connect.connect(function (err) {
    if (err) console.log(err)
    else console.log('mysql: connect database successfully !')
})

// interface
app.post('/getData', async function (req, res) {
    const data = url.parse(req.url, true).query;
    connect.query(`select id, title, front, reverse, remark from ${data.table}`, function (err, result) {
        if (err) console.log(err)
        else res.json(result)
    })
})

app.post('/addTag', async function (req, res) {
    const data = url.parse(req.url, true).query;
    connect.query(`insert into ${data.table} (title, front, reverse, remark) values ('${data.title}', '${data.front}', '${data.reverse}', '${data.remark}')`, function (err, result) {
        if (err) console.log(err)
        else res.json(1)
    })
})

app.post('/delTag', async function (req, res) {
    const data = url.parse(req.url, true).query;
    connect.query(`delete from ${data.table} where id = ${data.id}`, function (err, result) {
        if (err) console.log(err)
        else res.json(1)
    })
})

app.post('/fuzzySearch', async function (req, res) {
    const data = url.parse(req.url, true).query;
    const tables = [
        'templates', 'front', 'reverse', 'headwear', 'handwear',
        'dresses', 'skirt', 'pants', 'socks', 'shoes',
        'items', 'head', 'chest', 'arms', 'legs',
        'poses', 'hair', 'eyes', 'face', 'expression',
        'background', 'building', 'style', 'attributes', 'other'
    ]

    const result = {};

    tables.forEach((table, index) => {
        let sql;
        if (data.mode === 'title') {
            sql = `select title from ${table} where title like '%${data.fuzzy}%'`;
        }

        if (data.mode === 'tags') {
            sql = `select title from ${table} where front like '%${data.fuzzy}%' or reverse like '%${data.fuzzy}%';`
        }

        new Promise((resolve, rejects) => {
            connect.query(sql, function (err, r) {
                if (r.length !== 0) {
                    r.forEach(t => {
                        result[t.title] = table;
                    })
                }

                if (index === tables.length - 1) {
                    resolve(0)
                }
            });
        }).then(() => {
            res.json(result)
        })
    })
})

app.post('/bulkAdd', express.json(), async function (req, res) {
    const data = JSON.parse(url.parse(req.url, true).query.data)
    let rows = 0;

    Object.keys(data).forEach((key, index) => {
        const d = data[key]

        new Promise((resolve, rejects) => {
            connect.query(`insert into ${d.table_eng} (title, front, reverse, remark) values ('${d.title}', '${d.front}', '${d.reverse}', '${d.remark}')`, function (err, result) {
                if (err) console.log(err)
                else rows++

                if (index === Object.keys(data).length - 1) {
                    resolve(0)
                }
            })
        }).then(() => {
            res.json(rows)
        })
    })
})
