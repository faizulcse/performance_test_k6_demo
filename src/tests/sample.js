import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import {check, sleep} from 'k6';
import http from "k6/http";
import {envData} from "../utils/file_helper.js";

export const options = {
    thresholds: {
        "http_req_duration": [{threshold: 'p(90)<35', abortOnFail: true, delayAbortEval: '10s'}]
    },
    scenarios: {
        accountCreate: {
            executor: "per-vu-iterations",
            vus: 5,
            iterations: 10
        },
        accountCreate2: {
            executor: "shared-iterations",
            vus: 10,
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
                {duration: '20s', target: 100},
                {duration: '30s', target: 100},
                {duration: '0s', target: 0},
            ],
            gracefulRampDown: '30s'
        }
    }
}
export default function () {
    const res = http.get(`${envData.baseUrl}/api/users/2`);
    check(res, {'is status 200': (r) => r.status === 200});
    sleep(1);
}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}