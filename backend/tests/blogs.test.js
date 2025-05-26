const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper= require('../utils/list_helper')
const exp = require('node:constants')

const listWithOneBlog = [
  {
    'title': 'Go To Statement Considered Harmful',
    'author': 'Edsger W. Dijkstra',
    'url': 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    'likes': 5,
    '__v': 0,
    'id': '67c074ef4c6f72c3ac3c7ea1'
  }
]

const completeBlogList = [
  {
    'title': 'React patterns',
    'author': 'Michael Chan',
    'url': 'https://reactpatterns.com/',
    'likes': 7,
    '__v': 0,
    'id': '67c074be4c6f72c3ac3c7e9e'
  },
  {
    'title': 'Go To Statement Considered Harmful',
    'author': 'Edsger W. Dijkstra',
    'url': 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    'likes': 5,
    '__v': 0,
    'id': '67c074ef4c6f72c3ac3c7ea1'
  },
  {
    'title': 'Canonical string reduction',
    'author': 'Edsger W. Dijkstra',
    'url': 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    'likes': 5,
    '__v': 0,
    'id': '67c075114c6f72c3ac3c7ea3'
  },
  {
    'title': 'First class tests',
    'author': 'Robert C. Martin',
    'url': 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    'likes': 10,
    '__v': 0,
    'id': '67c075394c6f72c3ac3c7ea5'
  },
  {
    'title': 'TDD harms architecture',
    'author': 'Robert C. Martin',
    'url': 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    'likes': 11,
    '__v': 0,
    'id': '67c075594c6f72c3ac3c7ea7'
  },
  {
    'title': 'Type wars',
    'author': 'Robert C. Martin',
    'url': 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    'likes': 2,
    '__v': 0,
    'id': '67c0757a4c6f72c3ac3c7ea9'
  }
]

const emptyBlog= []


test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  console.log('result is',result)
  assert.strictEqual(result,1)
})

describe('total likes', () => {

  test('when the list has only one blog, the total likes, equal the likes of that blog:', () => {
    const result= listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result,5)
  })

  test('when the complete blog list is shared:', () => {
    const result= listHelper.totalLikes(completeBlogList)
    assert.strictEqual(result, 40)
  })

  test('of empty list is 0', () => {
    const result =listHelper.totalLikes(emptyBlog)
    assert.strictEqual(result, 0)
  } )
})

describe('Favourite blog', () => {

  test('when the complete blog list is shared:', () => {
    const result = listHelper.favoriteBlog(completeBlogList)
    console.log('result in favorite blog:',result)
    const expected= {
      'title': 'TDD harms architecture',
      'author': 'Robert C. Martin',
      'likes': 11,
    }

    assert.deepStrictEqual(result, expected)
  })
} )

describe('Most blogs', () => {

  test('The author with the most written blogs is', () => {
    const result = listHelper.mostBlogs(completeBlogList)
    console.log('result in most blogs',result)
    const expected={
      'author':'Robert C. Martin',
      'blogs': 3
    }

    assert.deepStrictEqual(result, expected)
  })
})

describe('Most Likes', () => {

  test('The author who has highest number of likes, all blogs combined:', () => {

    const result = listHelper.mostLikes(completeBlogList)
    console.log('result in most likes', result)
    const expected={
      'author': 'Robert C. Martin',
      'likes':23
    }

    assert.deepStrictEqual(result,expected)

  })
})