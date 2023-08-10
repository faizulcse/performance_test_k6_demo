import exec from "k6/execution";
import http from "k6/http";
import {check, group, sleep} from "k6";

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
    console.info(`Iterations id ==>  ${exec.scenario.iterationInTest} VU id ==> ${exec.vu.idInTest}`);

    group("passed_request", () => {
        const res = http.get("https://reqres.in/api/users/2");
        check(res, {'is status 200': (r) => r.status === 200});
    })

    group("failed_request", () => {
        const res2 = http.get("https://reqres.in/api/unknown/23");
        check(res2, {'is status 404': (r) => r.status === 404});
    })

    sleep(1);
}

