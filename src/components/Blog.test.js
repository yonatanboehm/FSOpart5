import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const mockHandler = jest.fn()

  beforeEach(() => {
    container = render(<Blog 
      title={'title'}
      url={'url'}
      author={'author'}
      likes={0}
      user={'user'}
      handleUpdate={mockHandler}
      />).container
  })
  test('renders summarized content but not expanded', () => {

    const divSummary = container.querySelector('#blog-summary')
    const divExpand = container.querySelector('#blog-expanded')

    expect(divSummary).not.toHaveStyle('display: none')
    expect(divExpand).toHaveStyle('display: none')

  })

  test('renders expanded content after clicking the view button', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    const divSummary = container.querySelector('#blog-summary')
    const divExpand = container.querySelector('#blog-expanded')

    await user.click(viewButton)

    expect(divSummary).toHaveStyle('display: none')
    expect(divExpand).not.toHaveStyle('display: none')
    
  })

  test('ensures that if the like button is clicked twice, function called twice', async () => {
    const user = userEvent.setup()
    const likeBlog = screen.getByText('like')

    await user.click(likeBlog)
    await user.click(likeBlog)
    console.log(mockHandler.mock.calls)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})

