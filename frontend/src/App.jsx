import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({message:null, type:''})
  const [loginVisible, setLoginVisible] = useState(null)

  const blogFormRef = useRef()
    
    useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    ) 
  }, [])

  useEffect(() => {

    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
 
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault() 
    console.log('logged in:', username, password)

    try{
      const user = await loginService.login({username, password})
      console.log('Login successful, user', user)
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      } catch (exception) {
        console.error('Login failed, full error:', exception)
        console.error('Error response:', exception?.response)
        setNotification({message:'Incorrect username or password', type:'error'})
        setTimeout(() => {
          setNotification({message:null, type:''})
        },5000)
        }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const createBlog = async (newBlog) => {

     try{
      const response = await blogService.create(newBlog)

      console.log('Blog created, response is:', response)
      setBlogs(blogs.concat(response))
      setNotification({message:`${response.title} by ${response.author} added`, type:'notification'})  
      setTimeout(()=> {setNotification({message:null, type:''})}, 5000)
      blogFormRef.current.toggleVisibility()    
    } catch(error) {
      setNotification({message:'Error saving the blog, try again', type:'error'})
      setTimeout(() => {setNotification({message:null, type:''})}, 5000)

      
    }
  }

  const loginForm = () => {

    const hideWhenVisible = {display:loginVisible? 'none' : ''}
    const showWhenVisible = {display:loginVisible? '':'none'}

    return(
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() =>setLoginVisible(true)}> Log in </button>
        </div>

        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({target}) => setUsername(target.value) }
            handlePasswordChange = {({target}) => setPassword(target.value) }
            handleLogin ={handleLogin}
            />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </div>
    )
  }

  const updateLike = async (blogToUpdate) => {

    const updatedBlog ={
      user:blogToUpdate.user.id,
      likes: blogToUpdate.likes + 1,
      author: blogToUpdate.author,
      title: blogToUpdate.title,
      url: blogToUpdate.url
    }

    try{
      const response = await blogService.update(updatedBlog,blogToUpdate.id)
      console.log('response received in updateLike is', response)
      
      setBlogs(blogs.map(
        (b=> b.id!==blogToUpdate.id
          ? b
          : response
        )
      ))
    } catch (error) {
      console.error('Failed to update likes', error)
      setNotification({message:'Failed to update likes', type:'error'})
      setTimeout(() => {
        setNotification({message:null, type:''})
      }, 5000)
    }

  }

  const deleteBlog = async (id) => {
    try{
      await blogService.remove(id)
      setBlogs(blogs.filter(blog=> blog.id!==id))
      setNotification({message:'Blog deleted successfully', type: 'notification'})
      setTimeout(()=> setNotification({message:null, type:''}), 5000)
    }catch(error){
      setNotification({message:'Failed to delete blog', type:'error'})
      setTimeout(() => setNotification({messagee:null, type:''}), 5000)
    }
  }

  return(
    <div>
      <h1>Blogs</h1>
      <Notification message={notification.message} type={notification.type}/>

      {!user&&loginForm()}

      {user && <div> 
        <h2>{user.username} is logged in </h2>
        <button onClick={handleLogout}>Logout</button>
        <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
        </div>}

        {user &&
        <div>
          <h2>List of blogs: </h2>
            {blogs
              .toSorted((a,b)=>b.likes-a.likes)
              .map(blog =>
                <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} updateLike={updateLike} currentUserID={user?.id}/>
              )
            }
        </div>
}
    </div>
  )

  

  }

export default App

  