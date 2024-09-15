import execution from 'k6/execution';
import { loginUser } from './helper/user.js';
import { createContact } from './helper/contact.js';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '10s',

  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)']
};

export function setup() {
  const totalContacts = __ENV.TOTAL_CONTACT || 10;
  const data = [];

  for (let i = 0; i < totalContacts; i++) {
    data.push({
      "first_name": "Kontak",
      "last_name": `Ke-${i}`,
      "email": `contact${i}@example.com`
    });
  }

  return data;
}

export function getToken() {
  const username = `contoh${execution.vu.idInInstance}`;

  const loginReqBody = {
    username: username,
    password: 'rahasia'
  };

  const loginResponse = loginUser(loginReqBody);
  const loginResBody = loginResponse.json();

  return loginResBody.data.token;
}

export default function (data) {
  const token = getToken();

  for (let i = 0; i < data.length; i++) {
    const contact = data[i];
    
    createContact(token, contact);
  }
}

export function teardown(data) {
  console.info(`Success create ${data.length} contacts`);
}
