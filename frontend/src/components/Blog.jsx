import { useState } from 'react'

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
    if(window.confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  // console.log('inside Blog.jsx, blog.user.id is:', blog.user.id)
  console.log('blog.user:', blog.user)
  console.log('currentUserID', currentUserID)


  return(

    <div style={blogStyle} className='blog'>
      <div style={topRowStyle} className='blogBasic'>
        <span className='blog-title-author'>
          {blog.title} by {blog.author}
        </span>
        <button onClick={toggleVisibility}>
          {visible?'Hide details':'View details'}
        </button>
      </div>

      {visible && (
        <div style={{ marginTop:10 }} className='blog-details'>
          <p>Url: {blog.url}</p>

          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span data-testid='like-count'>Likes:{blog.likes}</span>
            <button onClick={() => updateLike(blog)}>Like</button>
          </div>
          <p data-testid='blog-author'>Created by user: {blog.user.name}</p>

          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span>
              {/* {blog.user && currentUserID === blog.user.id && ( */}
              {blog.user?.id === currentUserID && (
                <>
                  {console.log('rendering delete button inside jsx')}
                  <button onClick={handleDelete} data-testid="delete-button">Delete</button>
                </>

              )}
            </span>
          </div>
        </div>
      )}
    </div>

  )
}

export default Blog