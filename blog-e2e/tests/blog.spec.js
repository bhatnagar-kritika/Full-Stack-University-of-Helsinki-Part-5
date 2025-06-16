const {test, expect, beforeEach, describe} = require('@playwright/test')
const { getByRole } = require('@testing-library/react')
const { loginWith, createBlog, buttonClicker} = require('./helper')
const { assert } = require('console')

describe('Blog app', () => {
    beforeEach(async ({page, request}) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name:'John Doe',
                username: 'JDoe',
                password: 'test01'
            }
        })
        await page.goto('/')
    })

    test('Login form is shown', async({page}) => {

        
        await expect(page.getByText('Login to the application')).toBeVisible()
        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
        await expect(page.getByRole('button',{name:'Login'})).toBeVisible()

    })

    describe('Login', ()=>{
        test('Succeeds with correct credentials', async ({page}) => {
            await loginWith(page, 'JDoe', 'test01')
            await expect(page.getByText('JDoe is logged in')).toBeVisible()
        })

        test('Login fails with incorrect username', async({page}) => {

            await loginWith(page, 'John Doe', 'test01')
            await expect(page.getByText('Incorrect username or password')).toBeVisible()

            const errorDiv = await page.locator('.error')
            await expect(errorDiv).toContainText('Incorrect username or password')
            await expect(errorDiv).toHaveCSS('border-style','dashed')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
        })

        test('Login fails with incorrect password', async({page}) => {

            await loginWith(page, 'JDoe', 'test')
            await expect(page.getByText('Incorrect username or password')).toBeVisible()

            const errorDiv = await page.locator('.error')
            await expect(errorDiv).toContainText('Incorrect username or password')
            await expect(errorDiv).toHaveCSS('border-style','dashed')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', () => {

        beforeEach(async ({page, request}) => {
       
        await loginWith(page, 'JDoe', 'test01')
        await expect(page.getByText('JDoe is logged in')).toBeVisible()

    })

        test('a new blog can be created', async ({page}) => {

            await createBlog(page, 'Test blog', 'John Doe', 'https://testblog.com')
            await expect(page.getByText('Test blog by John Doe added')).toBeVisible()
        })

        test('Blog can be liked', async ({page}) => {

        await createBlog(page, 'Test blog', 'John Doe', 'https://testblog.com')
        await expect(page.getByText('Test blog by John Doe added')).toBeVisible() 
        
        await page.getByRole('button',{name:'View details'}).click()
        await expect(page.getByTestId('like-count')).toHaveText('Likes:0')
        await page.getByRole('button', {name:'like'}).click()
        await expect(page.getByTestId('like-count')).toHaveText('Likes:1')

        })

        test('user who added the blog can delete the blog', async({page}) => {
        
        page.on('console', msg => {
            if(msg.type() === 'log') {
                console.log('logs:', msg.text())
            }
        })
        
        page.on('dialog', dialog=> dialog.accept())
        await createBlog(page, 'Test blog', 'Jack', 'https://testblog.com')
        await expect(page.getByText('Test blog by Jack added')).toBeVisible()
        await expect(page.getByText('Test blog by Jack',{exact:true})).toBeVisible()
        await page.getByRole('button', {name:'View details'}).click()
        await page.waitForSelector('.blog-details')
        const deleteButton = page.getByTestId('delete-button')
        await expect(deleteButton).toBeVisible()
        await deleteButton.click()
        await expect(page.getByText('Blog deleted successfully')).toBeVisible()
        })

        test('only user who created the blog can see delete button', async ({page, request}) => {

            await request.post('/api/users', {
                data: {
                    name: 'Jack Board',
                    username: 'JBoard',
                    password: 'test02'
                }
            } )

            
            await createBlog(page, 'Test blog', 'wingman', 'https://testblog.com')
            await expect(page.getByText('Test blog by wingman added')).toBeVisible()
            await page.getByRole('button', {name:'Logout'}).click()
            await loginWith(page, 'JBoard', 'test02' )
            await expect(page.getByText('JBoard is logged in')).toBeVisible()
            await page.getByRole('button', {name: 'View details'}).click()
            await expect(page.getByTestId('delete-button')).toHaveCount(0)
            
        })

        test('Blogs are sorted in descending order as per likes', async ({page, request}) => {
            await createBlog(page, '1st Test blog', 'Sunshine', 'https://testblog.com')
            await expect(page.getByText('Test blog by Sunshine added')).toBeVisible()
            const blog1 = page.locator('.blog').filter({hasText:'1st Test blog'})
            await blog1.getByRole('button', {name: 'View details'}).click()
            await buttonClicker(blog1, 'Like', 2)
            await expect(blog1.getByTestId('like-count')).toHaveText('Likes:2')
            
            await createBlog(page, '2nd Test blog', 'Wingman', 'https://testblog.com')
            await expect(page.getByText('Test blog by Wingman added')).toBeVisible()
            const blog2=page.locator('.blog').filter({hasText:'2nd Test blog' })
            await blog2.getByRole('button', {name: 'View details'}).click()
            await buttonClicker(blog2, 'Like', 5)
            await expect(blog2.getByTestId('like-count')).toHaveText('Likes:5')

            await createBlog(page, '3rd Test blog', 'Roses', 'https://testblog.com')
            await expect(page.getByText('Test blog by Roses added')).toBeVisible()
            const blog3=page.locator('.blog').filter({hasText:'3rd Test blog'})
            await blog3.getByRole('button', {name: 'View details'}).click()
            await buttonClicker(blog3, 'Like', 7)
            await expect(blog3.getByTestId('like-count')).toHaveText('Likes:7')

            const blogTitles = await page.locator('.blog .blog-title-author').allTextContents()
            
            const expectedOrder = [
                '3rd Test blog by Roses',
                '2nd Test blog by Wingman',
                '1st Test blog by Sunshine'
            ]

           expect(blogTitles).toEqual(expectedOrder)

        })

        })


        
    })

