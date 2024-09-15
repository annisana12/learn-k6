import { check } from "k6";
import http from "k6/http";

export function registerUser(reqBody) {
    const response = http.post('http://localhost:3000/api/users', JSON.stringify(reqBody), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    check(response, {
        'register response must be 200': (res) => res.status === 200,
        'register response body data must not be null': (res) => res.json().data != null
    });

    return response;
}

export function loginUser(reqBody) {
    const response = http.post('http://localhost:3000/api/users/login', JSON.stringify(reqBody), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    check(response, {
        'login response must be 200': (res) => res.status === 200,
        'login response token must exists': (res) => res.json().data.token != null
    });

    return response;
}

export function getUser(token) {
    const response = http.get('http://localhost:3000/api/users/current', {
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    });

    check(response, {
        'get current user response must be 200': (res) => res.status === 200,
        'get current user response body data must not be null': (res) => res.json().data != null
    });
}