import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import {check, sleep} from 'k6';
import {envData, usersCsv,} from "../utils/file_helper.js";
import exec from "k6/execution";
import http from "k6/http";

export const options = {
    thresholds: {
        "http_req_duration": [{threshold: 'p(90)<500', abortOnFail: true, delayAbortEval: '10s'}]
    },
    scenarios: {
        login: {
            executor: "shared-iterations",
            iterations: usersCsv.length,
            vus: 3,
            maxDuration: '30m'
        }
    }
}
export default function () {
    const user = usersCsv[exec.scenario.iterationInTest];
    const res = http.get(`${envData.baseUrl}/api/users/${user.id}`);
    check(res, {'is status 200': (r) => r.status === 200});
    sleep(1);
}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}