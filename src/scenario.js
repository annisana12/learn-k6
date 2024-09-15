import execution from "k6/execution";
import { createContact } from "./helper/contact.js";
import { loginUser, registerUser } from "./helper/user.js";
import { Counter } from "k6/metrics";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    thresholds: {
        user_registration_counter_success: ['count>190'],
        user_registration_counter_error: ['count<10']
    },
    scenarios: {
        userRegistration: {
            exec: "userRegistration",
            executor: "shared-iterations",
            vus: 10,
            iterations: 200,
            maxDuration: '30s'
        },
        contactCreation: {
            exec: "contactCreation",
            executor: "constant-vus",
            vus: 10,
            duration: '10s'
        }
    }
}

const registerCounterSuccess = new Counter("user_registration_counter_success");
const registerCounterError = new Counter("user_registration_counter_error");

export function userRegistration() {
    const uniqueId = uuidv4();

    const registerReqBody = {
        username: `user-${uniqueId}`,
        password: 'rahasia',
        name: 'Programmer Zaman Now'
    };

    const response = registerUser(registerReqBody);

    if (response.status === 200) {
        registerCounterSuccess.add(1);
    } else {
        registerCounterError.add(1);
    }
}

export function contactCreation() {
    const number = execution.vu.idInInstance % 9 + 1;
    const username = `contoh${number}`;

    const loginReqBody = {
        username: username,
        password: 'rahasia'
    };

    const loginResponse = loginUser(loginReqBody);

    const loginResBody = loginResponse.json();
    const token = loginResBody.data.token;

    const contact = {
        "first_name": "Kontak",
        "last_name": `Contoh`,
        "email": `contact@example.com`
    };

    createContact(token, contact);
}