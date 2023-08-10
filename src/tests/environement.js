import exec from "k6/execution";
import http from "k6/http";
import {check, sleep} from "k6";

export default function () {
    console.info(`Iterations id ==>  ${exec.scenario.iterationInTest} VU id ==> ${exec.vu.idInTest}`);
    console.info(__ENV.HOST_URL);

    const res = http.get(__ENV.HOST_URL);
    check(res, {'is status 200': (r) => r.status === 200});
    sleep(1);
}