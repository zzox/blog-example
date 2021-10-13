const express = require('express')
const app = express()
const { readFileSync } = require('fs')
const path = require('path')
const marked = require('marked')
const exhbs = require('express-handlebars')

const PAGE_SIZE = 10

marked.setOptions({
  highlight: (code, language) => {
    const hljs = require('highlight.js')
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
    return hljs.highlight(validLanguage, code).value
  }
})

const { posts } = JSON.parse(readFileSync('posts.json'))

const getPost = (postId) => posts.find(post => post.id === postId)

const getPosts = ({ page = 1, tag }) =>
  posts
    .filter(post => tag ? post.tags.includes(tag) : true)
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

const markdown = (postId) => {
  const file = path.join(process.cwd(), 'posts', `${postId}.md`)
  return marked(readFileSync(file).toString('utf-8'))
}

const blog = () => {
  const blogRouter = express.Router()

  blogRouter.get('/', (req, res) => {
    const { page, tagged } = req.query
    const pagePosts = getPosts({ page, tag: tagged })

    if (!pagePosts.length) {
      res.render('notFound')
      return
    }

    res.render('posts', { posts: pagePosts })
  })

  blogRouter.get('/:id', (req, res) => {
    const { id } = req.params
    const post = getPost(id)

    if (post) {
      res.render('post', {
        postId: id,
        title: post.title,
        author: post.author,
        subtitle: post.subtitle,
        tags: post.tags,
        created: post.created,
        pic: post.pic
      })
    } else {
      res.render('notFound')
    }
  })

  return blogRouter
}

const hbs = exhbs.create({
  extname: '.hbs',
  helpers: { markdown }
})

app.set('view engine', 'hbs')
app.engine('hbs', hbs.engine)
app.use(express.urlencoded({ extended: true }))

app.use('/blog', blog())

// TODO: better not found
app.get('/*', (req, res) => res.render('notFound'))

const PORT = 8000

app.listen(PORT, () => console.info(`listening on port ${PORT}`))
