import http from 'k6/http';
import { check, fail } from 'k6';
import execution from 'k6/execution';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '10s',

  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)']
};

export default function() {
  const username = `contoh${execution.vu.idInInstance}`;

  const loginReqBody = {
    username: username,
    password: 'rahasia'
  };

  const loginResponse = http.post('http://localhost:3000/api/users/login', JSON.stringify(loginReqBody), {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const loginCheck = check(loginResponse, {
    'login response must be 200': (res) => res.status === 200,
    'login response token must exists': (res) => res.json().data.token != null
  });

  if (!loginCheck) {
    fail(`Failed to login ${username}`);
  }

  const loginResBody = loginResponse.json();

  const currentUserResponse = http.get('http://localhost:3000/api/users/current', {
    headers: {
      'Accept': 'application/json',
      'Authorization': loginResBody.data.token
    }
  });

  const currentUserCheck = check(currentUserResponse, {
    'get current user response must be 200': (res) => res.status === 200,
    'get current user response body data must not be null': (res) => res.json().data != null
  });

  if (!currentUserCheck) {
    fail(`Failed to get data ${username}`);
  }
}
