import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1/astronomical-probe-tracker";

export const getProbesByTarget = async (target) => {
    const response = await axios.get(`${BASE_URL}/probes/${target}`);
    return response.data;
};

export const getLiveTelemetry = async (target, probeId) => {
    const response = await axios.get(`${BASE_URL}/live/${target}/${probeId}`);
    return response.data;
};