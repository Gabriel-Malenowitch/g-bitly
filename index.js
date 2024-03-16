const express = require('express')
const { connect } = require('./db')

const PORT = 3000

const app = express()

// Pattern: /create:url-name||redirect-url-name
// Example: http://localhost:3000/create:gugle||www.google.com
app.get('/create:*', async (req, res) => {
    const parsedUrl = decodeURI(req.url).replace(/\/create:/, '')
    const splittedUrl = parsedUrl.split('||')
    const urlName = splittedUrl?.[0]
    const redirectUrlName = splittedUrl?.[1]

    const client = await connect()
    
    const alreadyExistsQuery = await client.query(`select redirect_url_name from urls where url_name='${urlName}'`)
    const redirectUrl = alreadyExistsQuery?.rows?.[0]?.redirect_url_name
    // client.release();

    if (redirectUrl) {
        console.log(urlName)
        res.send(`Rota "/${urlName}" já existe e aponta para "${redirectUrl}".`)
        return
    }

    const dbRes = await client.query(`insert into urls (url_name, redirect_url_name) values ('${urlName}', '${redirectUrlName}')`);
    if(dbRes?.rowCount){
        res.send(`Rota criada de ${urlName} para ${redirectUrlName}.`)
    } else {
        res.send(`Tivemos um problema ao criar a rota`)
    }
})

app.get('/', async (req, res) => {
    const client = await connect()
    const result = await client.query('select * from urls')
    res.send(result.rows)
})

app.get('/*', async (req, res) => {
    const client = await connect()
    const queryResult = await client.query(`select redirect_url_name from urls where url_name='${req.url.replace('/', '')}'`)
    const result = queryResult?.rows?.[0]?.redirect_url_name

    if(result){
        res.redirect(result.includes('http') ? result : `https://${result}`)
        return
    }

    res.send('Esse link não existe, mas você pode criar com o comando: "/create:gugle||www.google.com."')

})


app.listen(PORT, () => console.log(`Server is running in port ${PORT}.`))