const express = require('express');

const routes = express.Router();

//Usuario fixo para teste
const users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
    }
];  

routes.post('/login', (request, response) => {
    const { email, password } = request.body;

    // Verifica se o email e a senha foram fornecidos
    if (!email || !password) {
        return response.status(400).send('Email and password are required');
    }

    const user = users.find(user => user.email === email && user.password === password);

    // Verifica se o usuário foi encontrado
    if (!user) {
        return response.status(401).send('Invalid email or password');
    }

    return response.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

module.exports = routes;