import http from "k6/http";
import {check, sleep} from "k6";
import {Counter} from "k6/metrics";
import {envData} from "../utils/file_helper.js";
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const allError = new Counter("error_count");
export const options = {
    thresholds: {
        "error_count": [{threshold: 'count < 10'}]
    },
    scenarios: {
        smoke: {
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
    const res = http.get(`${envData.baseUrl}/api/users/2`);
    check(res, {'is status 200': (r) => r.status === 200});
    allError.add(res !== 200);
    sleep(1);
}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}