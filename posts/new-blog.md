In the past couple weeks I have been working on a new application at my day job where we decided to implement it with server-side rendering using [Handlebars](https://handlebarsjs.com/), a templating engine, in conjuction with Node.js.  I mentioned to my co-worker that I had been looking to make my own site for a blog, but wanted something as simple as possible to not get bogged down by tooling. He showed me a short function used with a Node.js library [marked.js](https://github.com/markedjs/marked) which converted markdown to html:

```js
const markdown = (postId) => {
  const file = path.join(process.cwd(), 'posts', `${postId}.md` )
  return marked(readFileSync(file).toString('utf-8'))
}
```

And simple to use with handlebars after registering the helper function:

```html
<body>
	{{{ markdown postId }}}
</body>
```

To style the pages, I started with [marx](https://mblode.github.io/marx/) a classless css reset that I like the look of.  A css reset allows me to get a good starting point for a project without having to learn how a particular css framework's classes behave.  Markdown outputs all the `<h2>`, `<p>`, and `<ul>` tags (and many more) that I need to get a presentable html5 document. I added a few classes of my own to put everything how I wanted it, and it's ready to be seen.

### The hard part

<span class="highlight">Being a developer, making a decision on *how* to implement things can be harder than the implementation itself.</span> I was originally thinking about spinning up a database and adding all my posts there, but with my few (1) posts and not being a fervent writer, there are easier ways.  I have my post desctiptions and data in a single json file:

```json
{
	"posts": [{
		"id": "new-blog",
		"title": "New Blog!",
		"author": "tyler",
		"subtitle": "Making a simple blog in less than 100 lines of express.js code that is lightweight and easy to maintain.",
		"summary": "Too many technologies for the simplest concept",
		"tags": ["dev", "express", "web", "js", "blog"],
		"created": "January 20th, 2020",
		"pic": ""
	}, {
		// next post, etc...
	}]
}
```

and a couple of short functions to query it:

```js
const { posts } = JSON.parse(readFileSync('posts.json'))

const getPost = (postId) => posts.find(post => post.id === postId)

const getPosts = ({ page = 1, tag }) =>
  posts
    .filter(post => tag ? post.tags.includes(tag) : true)
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
```

and then I render the markdown file as html and serve it up.

### Posts

I write each post in [Markdown](https://www.markdownguide.org/basic-syntax/), and use a syntax highlighter ([hightlight.js](https://highlightjs.org/)) for all of the code.  I just need to add the post's metadata to the json file for every new post.  There's no use in going overboard with a CMS or anything of the sort.  I just commit, deploy and I'm ready to go!

Full example source code available [here.](https://github.com/zzox/blog-example)

<b>Note:</b> This was originally written in January of 2020 but I never got around to publishing it.
