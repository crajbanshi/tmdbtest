var swaggerConf = {
    "swagger": "2.0",
    "info": {
        "version": "2.0",
        "title": "CORE-API",
        "description": "CORE SERVICES API"
    },
    "host": "127.0.0.1:3001",
    "basePath": "/api",
    "schemes": [
        "http",
        "https"
    ],
    "securityDefinitions": {
        "APIKeyHeader": {
            "type": "apiKey",
            "in": "header",
            "name": "authorization",
            "description": "JWT <long alphnumeric string>"
        }
    },
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "tags": [{
            "name": "Status Check",
            "description": "connectivity"
        },
        {
            "name": "User",
            "description": "User data"
        }
    ],
    "paths": {
        "/": {
            "get": {
                "tags": [
                    "Status Check"
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/ResponseObject"
                        }
                    }
                }
            }
        },
        "/getUser": {
            "post": {
                "tags": [
                    "User"
                ],
                "parameters": [{
                    "name": "userid",
                    "in": "body",
                    "required": true,
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "Get User details",
                        "schema": {
                            "$ref": "#/definitions/ResponseObject"
                        }
                    },
                    "400": {
                        "description": "Error messages",
                        "schema": {
                            "$ref": "#/definitions/errorResponse"
                        }
                    }
                }
            }
        },
        "/getUsers": {
            "post": {
                "tags": [
                    "User"
                ],
                "parameters": [],
                "responses": {
                    "200": {
                        "description": "Get User array",
                        "schema": {
                            "$ref": "#/definitions/ResponseObject"
                        }
                    },
                    "400": {
                        "description": "Unable to updated Motorcycle",
                        "schema": {
                            "$ref": "#/definitions/errorResponse"
                        }
                    }
                }
            }
        },
        "/saveUser": {
            "post": {
                "tags": [
                    "User"
                ],
                "parameters": [{
                        "name": "fname",
                        "in": "body",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "lname",
                        "in": "body",
                        "required": false,
                        "type": "string"
                    },
                    {
                        "name": "username",
                        "in": "body",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "email",
                        "in": "body",
                        "required": true,
                        "type": "email"
                    },
                    {
                        "name": "password",
                        "in": "body",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "profileimage",
                        "in": "body",
                        "required": false,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Save a User",
                        "schema": {
                            "$ref": "#/definitions/ResponseObject"
                        }
                    },
                    "400": {
                        "description": "Unable to updated Motorcycle",
                        "schema": {
                            "$ref": "#/definitions/errorResponse"
                        }
                    }
                }
            }
        }

    },
    "definitions": {
        "ResponseObject": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "boolean"
                },
                "message": {
                    "type": "string"
                },
                "data": {
                    "type": "object"
                }
            }
        },
        "UserData": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "boolean"
                },
                "data": {
                    "type": "object"
                }
            }
        },
        "errorResponse": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "boolean"
                },
                "errors": {
                    "type": "object"
                }
            }
        }
    }

}

export default swaggerConf;