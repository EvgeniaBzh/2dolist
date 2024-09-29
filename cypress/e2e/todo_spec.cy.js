// cypress/e2e/todo_spec.cy.js

Cypress.on('uncaught:exception', (err, runnable) => {
  return false; 
});

describe('ToDo List Application', () => {
  beforeEach(() => {
  localStorage.clear();
  cy.visit('http://localhost:8080');
});

  it('Додає важливе завдання', () => {
    cy.get('#importantTaskInput').type('Купити продукти');
    cy.get('#addImportantTaskButton').click();

    cy.get('#importantTaskList').should('contain', 'Купити продукти');
  });

  it('Додає середнє завдання', () => {
    cy.get('#mediumTaskInput').type('Зателефонувати другу');
    cy.get('#addMediumTaskButton').click();

    cy.get('#mediumTaskList').should('contain', 'Зателефонувати другу');
  });

  it('Додає необов’язкове завдання', () => {
    cy.get('#optionalTaskInput').type('Прочитати книгу');
    cy.get('#addOptionalTaskButton').click();

    cy.get('#optionalTaskList').should('contain', 'Прочитати книгу');
  });

  it('Позначає важливе завдання як виконане', () => {
    cy.get('#importantTaskInput').type('Купити продукти');
    cy.get('#addImportantTaskButton').click();

    cy.get('#importantTaskList li').first().find('input[type="checkbox"]').check();

    cy.get('#importantTaskList li').first().find('span').should('have.class', 'completed');
  });

  it('Позначає середнє завдання як виконане', () => {
    cy.get('#mediumTaskInput').type('Зателефонувати другу');
    cy.get('#addMediumTaskButton').click();

    cy.get('#mediumTaskList li').first().find('input[type="checkbox"]').check();

    cy.get('#mediumTaskList li').first().find('span').should('have.class', 'completed');
  });

  it('Позначає необов’язкове завдання як виконане', () => {
    cy.get('#optionalTaskInput').type('Прочитати книгу');
    cy.get('#addOptionalTaskButton').click();

    cy.get('#optionalTaskList li').first().find('input[type="checkbox"]').check();

    cy.get('#optionalTaskList li').first().find('span').should('have.class', 'completed');
  });
    
    it('Видаляє важливе завдання', () => {
    cy.get('#importantTaskInput').type('Купити продукти');
    cy.get('#addImportantTaskButton').click();

    cy.get('#importantTaskList').should('contain', 'Купити продукти');

    cy.get('#importantTaskList li').first().find('.delete-button').click();

    cy.get('#importantTaskList').should('not.contain', 'Купити продукти');
  });

  it('Видаляє середнє завдання', () => {

    cy.get('#mediumTaskInput').type('Зателефонувати другу');
    cy.get('#addMediumTaskButton').click();

    cy.get('#mediumTaskList').should('contain', 'Зателефонувати другу');

    cy.get('#mediumTaskList li').first().find('.delete-button').click();

    cy.get('#mediumTaskList').should('not.contain', 'Зателефонувати другу');
  });

  it('Видаляє необов’язкове завдання', () => {

    cy.get('#optionalTaskInput').type('Прочитати книгу');
    cy.get('#addOptionalTaskButton').click();

    cy.get('#optionalTaskList').should('contain', 'Прочитати книгу');

    cy.get('#optionalTaskList li').first().find('.delete-button').click();

    cy.get('#optionalTaskList').should('not.contain', 'Прочитати книгу');
  });

  it('Переносить завдання з важливої категорії в середню', () => {

        cy.get('#importantTaskInput').type('Купити продукти');
        cy.get('#addImportantTaskButton').click();
        
        cy.get('#mediumTaskInput').type('Зателефонувати другу');
        cy.get('#addMediumTaskButton').click();
        
        cy.get('#importantTaskList').should('contain', 'Купити продукти');
        cy.get('#mediumTaskList').should('contain', 'Зателефонувати другу');

        cy.get('#importantTaskList li').first()
            .trigger('dragstart');
        
        cy.get('#mediumTaskList')
            .trigger('dragover')
            .trigger('drop');

        cy.get('#importantTaskList').should('not.contain', 'Купити продукти');

        cy.get('#mediumTaskList').should('contain', 'Купити продукти');
  });
    
    it('Переносить завдання з важливої категорії в неважливу', () => {
        cy.get('#importantTaskInput').type('Купити продукти');
        cy.get('#addImportantTaskButton').click();
        
        cy.get('#optionalTaskInput').type('Зателефонувати другу');
        cy.get('#addOptionalTaskButton').click();
        
        cy.get('#importantTaskList').should('contain', 'Купити продукти');
        cy.get('#optionalTaskList').should('contain', 'Зателефонувати другу');

        cy.get('#importantTaskList li').first()
            .trigger('dragstart');
        
        cy.get('#optionalTaskList')
            .trigger('dragover')
            .trigger('drop');

        cy.get('#importantTaskList').should('not.contain', 'Купити продукти');

        cy.get('#optionalTaskList').should('contain', 'Купити продукти');
    });
    
    it('Переносить завдання з сереньої категорії в неважливу', () => {
        cy.get('#mediumTaskInput').type('Купити продукти');
        cy.get('#addMediumTaskButton').click();
        
        cy.get('#optionalTaskInput').type('Зателефонувати другу');
        cy.get('#addOptionalTaskButton').click();
        
        cy.get('#mediumTaskList').should('contain', 'Купити продукти');
        cy.get('#optionalTaskList').should('contain', 'Зателефонувати другу');

        cy.get('#mediumTaskList li').first()
            .trigger('dragstart');
        
        cy.get('#optionalTaskList')
            .trigger('dragover')
            .trigger('drop');

        cy.get('#mediumTaskList').should('not.contain', 'Купити продукти');

        cy.get('#optionalTaskList').should('contain', 'Купити продукти');
    });
    
    it('Переносить завдання з сереньої категорії в важливу', () => {
        cy.get('#mediumTaskInput').type('Купити продукти');
        cy.get('#addMediumTaskButton').click();
        
        cy.get('#importantTaskInput').type('Зателефонувати другу');
        cy.get('#addImportantTaskButton').click();
        
        cy.get('#mediumTaskList').should('contain', 'Купити продукти');
        cy.get('#importantTaskList').should('contain', 'Зателефонувати другу');

        cy.get('#mediumTaskList li').first()
            .trigger('dragstart');
        
        cy.get('#importantTaskList')
            .trigger('dragover')
            .trigger('drop');

        cy.get('#mediumTaskList').should('not.contain', 'Купити продукти');

        cy.get('#importantTaskList').should('contain', 'Купити продукти');
    });
    
    it('Переносити завдання з неважливої категорії в середню', () => {
    cy.get('#optionalTaskInput').type('Купити продукти');
    cy.get('#addOptionalTaskButton').click();
    
    cy.get('#mediumTaskInput').type('Зателефонувати другу');
    cy.get('#addMediumTaskButton').click();
    
    cy.get('#optionalTaskList').should('contain', 'Купити продукти');
    cy.get('#mediumTaskList').should('contain', 'Зателефонувати другу');

    cy.get('#optionalTaskList li').first()
        .trigger('dragstart');
    
    cy.get('#mediumTaskList')
        .trigger('dragover')
        .trigger('drop');

    cy.get('#optionalTaskList').should('not.contain', 'Купити продукти');

    cy.get('#mediumTaskList').should('contain', 'Купити продукти');
});

    it('Переносить завдання з неважливої категорії в важливу', () => {
        cy.get('#optionalTaskInput').type('Купити продукти');
        cy.get('#addOptionalTaskButton').click();
        
        cy.get('#importantTaskInput').type('Зателефонувати другу');
        cy.get('#addImportantTaskButton').click();
        
        cy.get('#optionalTaskList').should('contain', 'Купити продукти');
        cy.get('#importantTaskList').should('contain', 'Зателефонувати другу');

        cy.get('#optionalTaskList li').first()
            .trigger('dragstart');
        
        cy.get('#importantTaskList')
            .trigger('dragover')
            .trigger('drop');

        cy.get('#optionalTaskList').should('not.contain', 'Купити продукти');

        cy.get('#importantTaskList').should('contain', 'Купити продукти');
    });
    
    it('Перетягує середнє завдання в межах категорії', () => {

    cy.get('#mediumTaskInput').type('Завдання 1');
    cy.get('#addMediumTaskButton').click();
    cy.get('#mediumTaskInput').type('Завдання 2');
    cy.get('#addMediumTaskButton').click();

    cy.get('#mediumTaskList li').contains('Завдання 2').drag('#mediumTaskList li:first');

    cy.get('#mediumTaskList li').eq(0).should('contain', 'Завдання 2');
    cy.get('#mediumTaskList li').eq(1).should('contain', 'Завдання 1');
    });
    
    it('Перетягує важливе завдання в межах категорії', () => {

    cy.get('#importantTaskInput').type('Завдання 1');
    cy.get('#addImportantTaskButton').click();
    cy.get('#importantTaskInput').type('Завдання 2');
    cy.get('#addImportantTaskButton').click();

    cy.get('#importantTaskList li').contains('Завдання 2').drag('#importantTaskList li:first'); 

    cy.get('#importantTaskList li').eq(0).should('contain', 'Завдання 2');
    cy.get('#importantTaskList li').eq(1).should('contain', 'Завдання 1');
    });
    
     it('Перетягує необовязкове завдання в межах категорії', () => {

    cy.get('#optionalTaskInput').type('Завдання 1');
    cy.get('#addOptionalTaskButton').click();
    cy.get('#optionalTaskInput').type('Завдання 2');
    cy.get('#addOptionalTaskButton').click();

    cy.get('#optionalTaskList li').contains('Завдання 2').drag('#optionalTaskList li:first'); 

    cy.get('#optionalTaskList li').eq(0).should('contain', 'Завдання 2');
    cy.get('#optionalTaskList li').eq(1).should('contain', 'Завдання 1');
  });

});
