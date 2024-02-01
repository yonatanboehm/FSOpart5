Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('createBlog', ({ title, url, author }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/blogs`,
    method: 'POST',
    body: { title, url, author },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })

  cy.visit('')
})

describe('Blog app', function() {
  beforeEach( function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'YBtest',
      username: 'yonatan',
      password: '1234'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user) 

    cy.visit('')
  })

  it('log in page is shown', function() {
    cy.contains('Log in to application')
  })

  it('user can log in', function() {
    cy.get('#username').type('yonatan')
    cy.get('#password').type('1234')
    cy.get('#login-button').click()

    cy.contains('YBtest logged in')
  })

  it('login fails with wrong password', function() {
    cy.get('#username').type('yonatan')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.notif').contains('invalid username or password')
    cy.get('.notif').should('have.css', 'border', '1.5px solid rgb(255, 0, 0)')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'yonatan', password: '1234' })
    })
    it('a new blog can be created', function () {
      cy.contains('create blog').click()
      cy.get('#title').type('cypress blog title')
      cy.get('#url').type('cy.press.com')
      cy.get('#author').type('cypress')
      cy.get('#create-blog').click()
      cy.contains('a new blog "cypress blog title" by cypress added.')
    })
    it.only('user can delete his created blog', function () {
      cy.contains('create blog').click()
      cy.get('#title').type('cypress blog title')
      cy.get('#url').type('cy.press.com')
      cy.get('#author').type('cypress')
      cy.get('#create-blog').click()
      cy.contains('cypress blog title cypress').contains('view').click()
      cy.contains('cypress blog title cypress hide').contains('remove').click()
      cy.get('html').should('not.contain','cypress blog title cypress hide')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'cypress blog title',
          url: 'cy.press.com',
          author: 'cypress'
        })
        cy.createBlog({
          title: 'cypress blog title2',
          url: 'cy.press.com2',
          author: 'cypress2'
        })
        cy.createBlog({
          title: 'cypress blog title3',
          url: 'cy.press.com3',
          author: 'cypress3'
        })
      })

      it('a blog can be liked', function () {
        cy.contains('cypress blog title2 cypress2').contains('view').click()
        cy.contains('cypress blog title2 cypress2 hide').contains('0').contains('like').click()
        cy.contains('cypress blog title2 cypress2 hide').contains('1').contains('like')
      })

    })
  })
})
