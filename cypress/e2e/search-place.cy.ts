describe('Search places', () => {

  it('user should be able to access home page', () => {
    cy.visit('http://localhost:3000')
  })

  it('user should be able to search for a valid place', () => {
    cy.visit('http://localhost:3000')
    cy.get('input').type('place20')
    cy.get('#place20:first')
  });

  it('user should be able to access a valid place page', () => {
    cy.visit('http://localhost:3000')
    cy.get('input').type('place1')
    cy.get('#place1:first')
      .get('button').contains('DONATE NOW').click()
  })

  it('user should be able to search for a invalid place', () => {
    cy.visit('http://localhost:3000')
    cy.get('input').type('school')
    cy.get('div').contains("No places found")
  });
})

