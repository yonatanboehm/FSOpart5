import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('Blog creating functions called with correct parameters', async () => {
    const user = userEvent.setup()
    const mockHandler = jest.fn()

    const container = render(<BlogForm handleCreate={mockHandler} user={{name: 'user'}}/>).container
    const title = container.querySelector('#title')
    const url = container.querySelector('#url')
    const author = container.querySelector('#author')

    const sendButton = screen.getByText('create')

    await user.type(title, 'title')
    await user.type(url, 'url')
    await user.type(author, 'author')

    await user.click(sendButton)
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('title')
    expect(mockHandler.mock.calls[0][0].url).toBe('url')
    expect(mockHandler.mock.calls[0][0].author).toBe('author')

  })
})
