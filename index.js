const Port = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const articles = []
const newsProviders = [
    {
        name: 'Naked Security',
        address: "https://nakedsecurity.sophos.com"
    },
    {
        name: 'Sophos News',
        address: 'https://news.sophos.com/en-us'
    },
    {
        name: 'Cloud7',
        address: 'https://cloud7.news/sophos'
    },
    {
        name: 'BleepingComputer',
        address: 'https://www.bleepingcomputer.com/tag/sophos'
    },
    {
        name: 'infosecurity-magazine',
        address: 'https://www.infosecurity-magazine.com/news'
    }
]

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

app.get('/',(req,res) => {
        res.json('Welcome to my Sophos News API')
})

app.get('/sophos',(req,res) => {
    res.json(articles)
})

app.get('/sophos/:newsProviderId', (req,res) => {
   const newsProviderId = req.params.newsProviderId
   const newsProviderAddress = newsProviders.filter(newsProvider => newsProvider.name == newsProviderId)[0].address
   const newsProviderBase = newsProviders.filter(newsProvider => newsProvider.name == newsProviderId)[0].base

   axios.get(newsProviderAddress)
   .then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    const specificArticles = []

    $('a',html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        specificArticles.push({
            title,
            url: newsProviderBase + url,
            source: newsProviderId
        })
    })
    res.json(specificArticles)
   }).catch(err => console.log(err))
})

app.listen(Port, () => console.log(`server running on Port ${Port}`))
