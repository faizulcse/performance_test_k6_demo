import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js"

export const envData = JSON.parse(open("../data/env.json"))[__ENV.HOST_NAME];
export const usersJson = JSON.parse(open("../data/users.json"));
export const usersCsv = papaparse.parse(open("../data/users.csv"), {header: true,}).data;
