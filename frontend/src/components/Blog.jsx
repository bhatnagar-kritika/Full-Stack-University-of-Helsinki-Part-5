import { useState } from "react"

const Blog = ({ blog, updateLike, deleteBlog, currentUserID }) => {

  const blogStyle = {
    border:'solid',
    padding: '10px',
  }

  const topRowStyle={
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center'
  }

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
  const handleDelete= () => {
    if(window.confirm(`Delete blog ${blog.title} by {blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  console.log('inside Blog.jsx, blog.user.id is:', blog.user.id)
  console.log('blog.user:', blog.user)
  console.log('currentUserID', currentUserID)
  return(

    <div style={blogStyle}>
        <div style={topRowStyle}>
          <span>
            {blog.title} by {blog.author}
          </span>
          <button onClick={toggleVisibility}>
            {visible?'Hide details':'View details'}
          </button>
        </div>

        {visible && (
          <div style={{marginTop:10}}>
            <p>Url: {blog.url}</p>
            <p> Likes:{blog.likes}<button onClick={() => updateLike(blog)}>Like</button></p>
            <p>Created by user: {blog.user.name}</p>
            <p>{blog.user && currentUserID === blog.user.id && (
              <button onClick={handleDelete}>Delete</button>
            )}</p>
          </div>
        )}
    </div>

  ) 
}

export default Blog