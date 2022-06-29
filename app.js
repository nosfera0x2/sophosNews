const Port = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const url = "https://news.sophos.com/en-us/"
const articles = []

newsProviders.forEach(newsProvider => {
    axios.get(newsProvider.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            // if searching for a specific a tag with certain text
            // $('a:contains("climate")',html).each(function () { 
            $('a',html).each(function () {
                const title = $(this).title
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    source: newsProvider.name
                })
            })
        })

})

const newsProviders = [
    {
        name: 'Naked Security',
        address: "https://nakedsecurity.sophos.com"
    },
    {
        name: 'Sophos Press',
        address: 'https://www.sophos.com/en-us/company/press'
    },
    {
        name: 'Sophos News',
        address: 'https://news.sophos.com/en-us/'
    }
]

app.get('/',(req,res) => {
        res.json('Welcome to my Sophos News API')
})

app.get('/sophos',(req,res) => {
    res.json(articles)
})


app.listen(Port, () => console.log(`server running on Port ${Port}`))