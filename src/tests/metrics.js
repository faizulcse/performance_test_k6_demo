import http from "k6/http";
import {check, sleep} from "k6";
import {Counter} from "k6/metrics";
import {envData} from "../utils/file_helper.js";

const allError = new Counter("error_count");
export const options = {
    thresholds: {
        "error_count": [{threshold: 'count < 10', abortOnFail: true}]
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
    if (res.status >= 400)
        allError.add(1);
    check(res, {'is status 200': (r) => r.status === 200});

    const res2 = http.get(`${envData.baseUrl}/api/unknown/23`);
    if (res2.status >= 400)
        allError.add(1);

    sleep(1);
}

