import { useState } from 'react'

const BlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 

  const createBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      url,
      author
    }
    await handleCreate(blogObject)
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={createBlog}>
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
  )
}

export default BlogForm
