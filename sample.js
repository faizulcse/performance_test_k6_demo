import {check, sleep} from 'k6';
import exec from "k6/execution";
import http from "k6/http";

export const users = JSON.parse(open("data.json"))


export const options = {
    scenarios: {
        accountCreate: {
            executor: "per-vu-iterations",
            vus: 5,
            iterations: 10
        },
        accountCreate2: {
            executor: "shared-iterations",
            vus: 3,
            iterations: 10
        },
        accountCreate3: {
            executor: "constant-vus",
            vus: 10,
            duration: '10s'
        },
        accountCreate4: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                {duration: '20s', target: 10},
                {duration: '30s', target: 10},
                {duration: '0s', target: 0},
            ],
            gracefulRampDown: '30s'
        }

    }
}
export default function () {
    console.info(`Iterations id ==>  ${exec.scenario.iterationInTest} VU id ==> ${exec.vu.idInTest}`);
    const baseUrl = "https://reqres.in/"
    const endPoint = "api/users/2";

    const res = http.get(`${baseUrl}${endPoint}`);
    check(res, {'is status 200': (r) => r.status === 200});
    sleep(1);
}
