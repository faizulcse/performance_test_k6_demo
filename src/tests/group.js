import http from "k6/http";
import {check, group, sleep} from "k6";
import {envData} from "../utils/file_helper.js";

export const options = {
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
    group("valid_api_request", () => {
        const res = http.get(`${envData.baseUrl}/api/users/2`);
        check(res, {'is status 200': (r) => r.status === 200});
    })

    group("invalid_api_request", () => {
        const res = http.get(`${envData.baseUrl}/api/unknown/23`);
        check(res, {'is status 404': (r) => r.status === 404});
    })

    sleep(1);
}

