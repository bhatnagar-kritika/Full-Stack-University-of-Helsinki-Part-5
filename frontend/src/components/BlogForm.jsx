import { useState } from "react"

const BlogForm = ({createBlog}) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setURL] =useState('')

     const newBlog = (event) => {
        event.preventDefault()
        createBlog({title, author, url})
     }

    return(

        <div>
            <h2>Add a new blog:</h2>
            <form onSubmit={newBlog}>
                <p>Title <input type="text" value={title} onChange={({target}) => setTitle(target.value)}/>
                </p>
                
                <p>
                    Author <input type="text" value={author} onChange={({target}) => setAuthor(target.value)}/>
                </p>

                <p>
                    url <input type="url" value={url} onChange={({target}) => setURL(target.value)} />
                </p>

                <button type="Submit">Create</button>

            </form>
        </div>

    )
}

export default BlogForm