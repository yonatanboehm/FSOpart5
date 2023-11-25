import { useState } from 'react'

const Blog = (blog) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const isUserUploader = blog.usernameBlog === blog.usernameUser ? {display: ''} : {display: 'none'}

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeBlog = async () => {
    await blog.handleUpdate(blog.id)
  }

  const removeBlog = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      await blog.handleRemove(blog.id)
    }
    return
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
        <div>{blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button></div>
        <div>{blog.url}</div>
        <div>{blog.likes} <button onClick={likeBlog}>like</button></div>
        <div>{blog.user}</div>
        <div style={isUserUploader}><button onClick={removeBlog}>remove</button></div>
      </div>
    </div>  
  )
}

export default Blog