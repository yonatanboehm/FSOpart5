import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ handleCreate, user }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      url,
      author,
      user: {
        name: user.name
      }
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
            id="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={url}
            name="URL"
            id="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={author}
            name="author"
            id="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleCreate: PropTypes.func.isRequired,
  // user: PropTypes.object.isRequired
}

export default BlogForm
