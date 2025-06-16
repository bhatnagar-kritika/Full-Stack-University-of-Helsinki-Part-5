import {expect} from '@playwright/test'

const loginWith = async (page, username, password) => {
    
    const loginText = await page.getByText(/Login to the application/i)
    await expect(loginText).toBeVisible()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', {name:'Login'}).click()

}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', {name:'Create a new blog'}).click()
    await expect(page.getByText('Add a new blog:')).toBeVisible()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button',{name:'Create'}).click()     
}

const buttonClicker= async (scope, buttonName, times) => {
    for(let i=0; i<times; i++) {
        await scope.getByRole('button', {name:buttonName}).click()
        await expect(scope.getByTestId('like-count')).toHaveText(`Likes:${i+1}`, {timeout:3000})
    }
}

export {loginWith, createBlog, buttonClicker}