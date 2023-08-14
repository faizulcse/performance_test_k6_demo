import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js'
import exec from "k6/execution";
import http from "k6/http";
import {check} from "k6";
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const usersCsv = papaparse.parse(open("../data/users.csv"), {header: true,}).data;

export const options = {
    scenarios: {
        jsonWithLogin: {
            executor: "shared-iterations",
            vus: usersCsv.length,
            iterations: usersCsv.length
        }
    }
};

export default function (data) {
    const index = exec.scenario.executor === "shared-iterations" ? exec.scenario.iterationInTest : exec.vu.idInTest - 1;
    const user = usersCsv[index];
    const response = http.get(`https://reqres.in/api/users/${user.id}`);
    check(response, {'is status 200': (r) => r.status === 200});

    const resData = response.json("data");
    check(response, {
        "is user email correct": (r) => resData.email === user.email,
        "is user first_name correct": (r) => resData.first_name === user.first_name,
        "is user last_name correct": (r) => resData.last_name === user.last_name,
    })
}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}