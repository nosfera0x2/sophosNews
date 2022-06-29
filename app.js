const Port = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const url = "https://www.news.sophos.com/en-us/feed"
const articles = []

app.get('/',(req,res) => {
        res.json('Welcome to my Sophos News API')
})

app.get('/sophos',(req,res) => {

    axios.get(url)
        .then((response) => {
                const html = response.data
                const $ = cheerio.load(html)
                
                // if searching for a specific a tag with certain text
                // $('a:contains("climate")',html).each(function () { 
                
                $('a',html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')
                    articles.push({
                        title,
                        url
                    })
                })
                res.json(articles)
        }).catch(err => console.log(err))
})


app.listen(Port, () => console.log(`server running on Port ${Port}`))