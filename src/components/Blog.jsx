import { useState } from 'react'

const Blog = (blog) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeBlog = async () => {
    await blog.handleUpdate(blog.id)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <div>{blog.title} {blog.author} <button onClick={toggleVisibility}>view</button></div>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.title} {blog.author}</div>
        <div>{blog.url}</div>
        <div>{blog.likes} <button onClick={likeBlog}>like</button></div>
        <div>{blog.user}</div>
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>  
  )
}

export default Blog