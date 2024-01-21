import uuid from 'react-uuid';
import axios from 'axios';

class DataBase {
    static async checkInDuel() {
        const uid = getUID();
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_LINK}/duels/checkUserInDuel/${uid}`);
            return data;
        } catch (e) {
            console.log(e);
            // return {inDuel: true, message: 'Try Again Later...'};
        }
    }

    static async getAllDuels() {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_LINK}/duels/`);
            return data.duels;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    static async createDuel(params) {
        try {
            const checker = await this.checkInDuel();
            if (checker.inDuel) {
                return [false, checker];
            }
            const response = await axios.post(`${process.env.REACT_APP_SERVER_LINK}/duels/add`, params);
            return [true, response.data];
        } catch (error) {
            console.error('Error:', error);
            return [false];
        }
    }

    static async getDuelById(id) {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_LINK}/duels/getById/${id}`);
            return data.duel;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async findProblem(id) {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_LINK}/problems/getProblem/${id}`);
            return data.problem;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async submitProblem(submission) {
        try {
            console.log(submission);
            let result = await axios.post(`${process.env.REACT_APP_SUB_SERVER_LINK}/submitProblem`, submission);
            result = result.data;
            return [result.result, result];
        } catch (e) {
            console.log(e);
            return [false];
        }
    }

    static async getVerdict(id) {
        try {
            let result = await axios.get(`${process.env.REACT_APP_SUB_SERVER_LINK}/getSubmissionData/${id}`);
            result = result.data;
            return result.verdict;
        } catch (e) {
            console.log(e);
            return 'TESTING';
        }
    }

    static async getSubmissions(id) {
        try {
            let result = await axios.get(`${process.env.REACT_APP_SUB_SERVER_LINK}/getDuelSubmissions/${id}`);
            result = result.data;
            console.log("database sub:", result);
            return result.submissions;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    static async sendContact(params) {
        try {
            await axios.post(`${process.env.REACT_APP_SERVER_LINK}/mail`, params);
            return true;
        } catch (e) {
            console.log(e);
            return true;
        }
    }
}

export const handleUID = () => {
    let uid = localStorage.getItem('lockout-uid');
    if (!uid) {
        uid = uuid();
        localStorage.setItem('lockout-uid', uid);
    }
}

export const getUID = () => {
    handleUID();
    let uid = localStorage.getItem('lockout-uid');
    return uid;
}
export default DataBase;