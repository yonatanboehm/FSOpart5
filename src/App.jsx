import { useState, useEffect } from 'react'
import Blog from './components/Blog'
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
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ message: null, type: null}) 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
    } catch (exception) {
      setMessage({ message: exception.response.data.error, type: null})
      setTimeout(() => {
        setMessage({ message: null, type: null})
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      url,
      author
    }
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setAuthor('')
      setTitle('')
      setUrl('')
      setMessage({
        message: `a new blog "${returnedBlog.title}" by ${returnedBlog.author} added.`,
        type: true
      })
      setTimeout(() => {
        setMessage({ message: null, type: null})
      }, 5000)
    } catch (exception) {
      setMessage({ 
        message: exception.response.data.error,
        type: false
      }) // test this
      setTimeout(() => {
        setMessage({ message: null, type: null})
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message.message} type={message.type} />
        { loginForm() }
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
      <div>
        <form onSubmit={handleCreate}>
          <div>
            Title:
              <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            URL:
              <input
              type="text"
              value={url}
              name="Password"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <div>
            Author:
              <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
              />
          </div>
          <button type="submit">create</button>
        </form>    
      </div>
      <div>
        <ul>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </ul>
      </div>
    </div>
  )
}

export default App