import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] =useState('')

  const newBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
  }

  return(

    <div>
      <h2>Add a new blog:</h2>
      <form onSubmit={newBlog}>

        <p><label htmlFor="blog-title">Title </label>
          <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} id='blog-title' data-testid='title'/>
        </p>

        <p>
          <label htmlFor='blog-author'>Author</label>
          <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} id='blog-author' data-testid='author'/>
        </p>

        <p>
          <label  htmlFor='blog-url'>url</label>
          <input type="url" value={url} onChange={({ target }) => setURL(target.value)} id='blog-url' data-testid='url'/>
        </p>

        <button type="Submit">Create</button>

      </form>
    </div>

  )
}

export default BlogForm