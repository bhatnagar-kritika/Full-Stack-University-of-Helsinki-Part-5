import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'

describe('testing the blog', () => {
  const blog= {
    title: 'Testing if author and title are rendered',
    author: 'Test author',
    url: 'http:bloglist.com',
    likes: 11,
    user:{
      id: '1234',
      name: 'Joe'
    }
  }

  const mockUpdateLike = vi.fn()
  const mockdeleteBlog = vi.fn()
  const createBlog = vi.fn()
  const newBlog = vi.fn()

  test('renders title and author only by default', async () => {
    render(
      <Blog
        blog={blog}
        updateLike={mockUpdateLike}
        deleteBlog={mockdeleteBlog}
        currentUserID='1234'
      />
    )

    const basicInfo = screen.getByText((content) =>
      content.includes('Testing if author and title are rendered') &&
      content.includes('Test author'))

    expect(basicInfo).toBeDefined()

    const url=screen.queryByText('Url:',{ exact: false })
    const likes= screen.queryByText('Likes:',{ exact:false })

    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('URL and likes shown when button clicked', async () => {
    render(<Blog
      blog={blog}
      updateLike={mockUpdateLike}
      deleteBlog={mockdeleteBlog}
      currentUserID='1234'/>)

    const button = screen.getByText('View details')
    const user=userEvent.setup()
    await user.click(button)

    const url=await screen.findByText(/Url:/i) //this is to match text 'url:' but case insensitive
    const likes=await screen.findByText(/likes:/i)

    expect(url).toBeTruthy()
    expect(likes).toBeTruthy()
  })

  test('On double like, event handler called twice', async () => {

    render(<Blog
      blog={blog}
      updateLike={mockUpdateLike}
      deleteBlog={mockdeleteBlog}
      currentUserID='1234' />)



    const viewButton = screen.getByText(/View details/i)
    const user= userEvent.setup()
    await user.click(viewButton)
    const likeButton= screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateLike).toHaveBeenCalledTimes(2)
  })

  test('On creating new blog createblog is called', async() => {
    render(<BlogForm createBlog={createBlog}/>)

    //const createButton = screen.getByText(/Create a new blog/i)
    const user=userEvent.setup()
    //await user.click(createButton)

    const titleInput = screen.getByLabelText(/title/i) //this will look for a label whose text is 'title
    await user.type(titleInput,'New blog test')

    const authorInput = screen.getByLabelText(/author/i)
    await user.type(authorInput,'Joe')

    const urlInput = screen.getByLabelText(/url/i)
    await user.type(urlInput,'https:newblog.com')

    const saveButton = screen.getByText(/Create/i)
    await user.click(saveButton)

    expect(createBlog).toHaveBeenCalledTimes(1)

  })
})