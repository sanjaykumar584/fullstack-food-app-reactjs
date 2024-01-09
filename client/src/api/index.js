import axios from "axios";

export const baseURL = "http://localhost:5001/fullstack-food-app-react-5edcc/us-central1/app";

export const validateUserJWTToken = async (token) => {
    try {
        const res = await axios.get(`${baseURL}/api/users/jwtVerification`, {
            headers: {Authorization: `Bearer ${token}`}
        })
        return res.data.data;
    } catch (error) {
        return null;
    }
}