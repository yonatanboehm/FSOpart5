import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = (message) => {

  if (message.message === null) {
    return null
  }
  const notifStyle = message.type ? { color: 'green' } : { color: 'red' }

  return (
    <div style={notifStyle} className='notif'>
      {message.message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState({ message: null, type: null })
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((blog1, blog2) => blog2.likes - blog1.likes)
      setBlogs( sortedBlogs )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (username, password) => {

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
    } catch (exception) {
      setMessage({ message: exception.response.data.error, type: null })
      setTimeout(() => {
        setMessage({ message: null, type: null })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      setMessage({
        message: `a new blog "${returnedBlog.title}" by ${returnedBlog.author} added.`,
        type: true
      })
      setTimeout(() => {
        setMessage({ message: null, type: null })
      }, 5000)
    } catch (exception) {
      setMessage({
        message: exception.response.data.error,
        type: false
      }) // test this
      setTimeout(() => {
        setMessage({ message: null, type: null })
      }, 5000)
    }
  }

  const handleUpdate = async (id) => {
    try {
      const returnedBlog = await blogService.getOne(id)
      returnedBlog.likes++
      await blogService.update(id, returnedBlog)

      const likedBlog = blogs.find(blog => blog.id === id)
      likedBlog.likes++
      const updatedBlogs = blogs.map(blog => blog.id === id ? likedBlog : blog)
      const sortedBlogs = updatedBlogs.sort((blog1, blog2) => blog2.likes - blog1.likes)
      setBlogs( sortedBlogs )
      setBlogs(updatedBlogs)
    } catch (exception) {
      console.log(exception)
      setMessage({
        message: exception.response.data.error,
        type: false
      }) // test this
      setTimeout(() => {
        setMessage({ message: null, type: null })
      }, 5000)
    }
  }

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id)
      const blogsAfterDelete = blogs.filter(blog => blog.id !== id)
      setBlogs(blogsAfterDelete)
      setMessage({
        message: 'Deleted blog',
        type: true
      })
      setTimeout(() => {
        setMessage({ message: null, type: null })
      }, 5000)
    } catch (exception) {
      setMessage({
        message: exception.response.data.error,
        type: false
      }) // test this
      setTimeout(() => {
        setMessage({ message: null, type: null })
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message.message} type={message.type} />

        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message.message} type={message.type} />
      <div>
        <p>
          {user.name} logged in <button onClick={handleLogout}>log out</button>
        </p>
      </div>
      <div>
        <h2>create new</h2>
      </div>
      <Togglable buttonLabel='create blog' ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} user={user}/>
      </Togglable>
      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            title={blog.title}
            url={blog.url}
            author={blog.author}
            likes={blog.likes}
            user={blog?.user?.name === undefined ? '' : blog.user.name}
            usernameBlog={blog?.user?.username} // question mark because no creating user in test ENV
            usernameUser={user?.username}
            id={blog.id}
            handleUpdate={handleUpdate}
            handleRemove={handleRemove}
          />
        )}
      </div>
    </div>
  )
}

export default App