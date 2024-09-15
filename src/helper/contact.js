import { check } from "k6";
import http from "k6/http";

export function createContact(token, contact) {
    const response = http.post('http://localhost:3000/api/contacts', JSON.stringify(contact), {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        }
    });

    check(response, {
        'create contact response must be 200': (res) => res.status === 200
    });

    return response;
}