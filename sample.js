import http from 'k6/http';
import {sleep} from 'k6';

export default function () {
    const baseUrl = "https://reqres.in/"
    const endPoint = "api/users/2";

    const res = http.get(`${baseUrl}${endPoint}`);
    console.log(res);
    sleep(1);
}
