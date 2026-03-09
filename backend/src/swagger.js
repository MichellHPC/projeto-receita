const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Projeto Receita API',
            version: '1.0.0',
            description: 'Documentacao das rotas de UsuarioController e ReceitaController'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],
        tags: [
            { name: 'Auth', description: 'Autenticacao' },
            { name: 'Usuarios', description: 'CRUD de usuarios' },
            { name: 'Receitas', description: 'CRUD de receitas' }
        ],
        components: {
            schemas: {
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'michell.rv@gmail.com' },
                        password: { type: 'string', example: 'senha123' }
                    }
                },
                UsuarioCreateRequest: {
                    type: 'object',
                    required: ['nome', 'email', 'password'],
                    properties: {
                        nome: { type: 'string', example: 'Maria Silva' },
                        email: { type: 'string', example: 'maria@email.com' },
                        password: { type: 'string', example: '123456' }
                    }
                },
                UsuarioUpdateRequest: {
                    type: 'object',
                    properties: {
                        nome: { type: 'string', example: 'Maria Silva Atualizada' },
                        email: { type: 'string', example: 'maria.atualizada@email.com' },
                        password: { type: 'string', example: 'novaSenha123' }
                    }
                },
                UsuarioResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string' },
                        email: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                ReceitaCreateRequest: {
                    type: 'object',
                    required: ['criador_id', 'nome'],
                    properties: {
                        criador_id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string', example: 'Bolo de Cenoura' },
                        descricao: { type: 'string', example: 'Bolo fofinho com cobertura de chocolate' }
                    }
                },
                ReceitaUpdateRequest: {
                    type: 'object',
                    properties: {
                        nome: { type: 'string', example: 'Bolo de Cenoura Atualizado' },
                        descricao: { type: 'string', example: 'Descricao nova da receita' }
                    }
                },
                ReceitaResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string' },
                        descricao: { type: 'string' },
                        criador_id: { type: 'string', format: 'uuid' },
                        criador_nome: { type: 'string' },
                        criador_email: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Erro ao processar requisicao' }
                    }
                }
            }
        },
        paths: {
            '/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Realiza login do usuario',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginRequest' }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Login realizado com sucesso' },
                        400: { description: 'Email e senha obrigatorios', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        401: { description: 'Credenciais invalidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                }
            },
            '/usuarios': {
                get: {
                    tags: ['Usuarios'],
                    summary: 'Lista todos os usuarios',
                    responses: {
                        200: {
                            description: 'Lista de usuarios',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/UsuarioResponse' }
                                    }
                                }
                            }
                        },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                },
                post: {
                    tags: ['Usuarios'],
                    summary: 'Cria um novo usuario',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UsuarioCreateRequest' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Usuario criado com sucesso' },
                        400: { description: 'Campos obrigatorios ausentes', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        409: { description: 'Email ja cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                }
            },
            '/usuarios/{id}': {
                get: {
                    tags: ['Usuarios'],
                    summary: 'Busca usuario por ID',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
                    ],
                    responses: {
                        200: { description: 'Usuario encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioResponse' } } } },
                        404: { description: 'Usuario nao encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                },
                put: {
                    tags: ['Usuarios'],
                    summary: 'Atualiza usuario por ID',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UsuarioUpdateRequest' }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Usuario atualizado com sucesso' },
                        400: { description: 'Nenhum campo informado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        404: { description: 'Usuario nao encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        409: { description: 'Email ja cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                },
                delete: {
                    tags: ['Usuarios'],
                    summary: 'Remove usuario por ID',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
                    ],
                    responses: {
                        200: { description: 'Usuario removido com sucesso' },
                        404: { description: 'Usuario nao encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                }
            },
            '/receitas': {
                get: {
                    tags: ['Receitas'],
                    summary: 'Lista todas as receitas',
                    responses: {
                        200: {
                            description: 'Lista de receitas',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/ReceitaResponse' }
                                    }
                                }
                            }
                        },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                },
                post: {
                    tags: ['Receitas'],
                    summary: 'Cria uma nova receita',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ReceitaCreateRequest' }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Receita criada com sucesso' },
                        400: { description: 'Campos obrigatorios ausentes', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        404: { description: 'Usuario criador nao encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                }
            },
            '/receitas/{id}': {
                get: {
                    tags: ['Receitas'],
                    summary: 'Busca receita por ID',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
                    ],
                    responses: {
                        200: { description: 'Receita encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ReceitaResponse' } } } },
                        404: { description: 'Receita nao encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                },
                put: {
                    tags: ['Receitas'],
                    summary: 'Atualiza receita por ID',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ReceitaUpdateRequest' }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Receita atualizada com sucesso' },
                        400: { description: 'Nenhum campo informado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        404: { description: 'Receita nao encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                },
                delete: {
                    tags: ['Receitas'],
                    summary: 'Remove receita por ID',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
                    ],
                    responses: {
                        200: { description: 'Receita removida com sucesso' },
                        404: { description: 'Receita nao encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                }
            },
            '/receitas/usuario/{criador_id}': {
                get: {
                    tags: ['Receitas'],
                    summary: 'Lista receitas por usuario',
                    parameters: [
                        { name: 'criador_id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
                    ],
                    responses: {
                        200: {
                            description: 'Lista de receitas do usuario',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/ReceitaResponse' }
                                    }
                                }
                            }
                        },
                        500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};
