const _= require('lodash')

const dummy = (blogs) => {
  return 1

}

const totalLikes = (blogs) => {
  const reducer= (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (favorite, blog) => {
    return blog.likes>favorite.likes?blog:favorite
  }

  const favorite=  blogs.reduce(reducer, { likes:0 })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {

  const countAuthorBlog = _.countBy(blogs, 'author')

  const topAuthor = _.maxBy(Object.keys(countAuthorBlog), blog => countAuthorBlog[blog])
  console.log('in mostblogs top author is:',topAuthor)
  return {
    author: topAuthor,
    blogs: countAuthorBlog[topAuthor] //here keys are the names of the authors, and values are the counts of their blogs
  }
}

const mostLikes = (blogs) => {
  const groupByAuthor = _.groupBy(blogs, 'author')

  const sumAuthorLikes = _.mapValues(groupByAuthor, (blogs) => {
    return _.sumBy(blogs, 'likes')
  })

  const topAuthor = _.maxBy(Object.keys(sumAuthorLikes), (author) => sumAuthorLikes[author])

  return {
    author: topAuthor,
    likes: sumAuthorLikes[topAuthor]
  }
}

module.exports ={
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
