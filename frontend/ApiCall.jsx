import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8001/",
    withCredentials: true   // GLOBAL — this is enough
});

// LOGIN
export const UserSignIn = async (email, password) => {
    try {
        const response = await api.post('user/login', { email, password });
        return response;
    } catch (error) {
        return error.response;
    }
};

// SIGN UP
export const UserSignUp = async (name, email, username, password) => {
    try {
        const response = await api.post('user/', {
            name, email, username, password
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

// UPDATE PROFILE
export const CompleteUserProfile = async (email, title, designation, about) => {
    try {
        const response = await api.post('user/update', {
            email, title, designation, about
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

// CREATE POST  (FIXED!!)
export const CreatePost = async (destination, totalPersons, TravelMonth, BudgetPerPerson, description) => {
    try {
        const response = await api.post('post/create', {
            destination,
            totalPersons,
            TravelMonth,
            BudgetPerPerson,
            description
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

// FETCH POSTS
export const FetchPost = async () => {
    try {
        const response = await api.get('post/fetch');
        return response;
    } catch (error) {
        return error.response;
    }
};

// UNSPLASH API
export const PostImages = async (destination) => {
    const query = `${destination} tourism`;

    try {
        const response = await axios.get(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=3StF_Gofq_OG9yN9Wuq4-RHJM-b7jh89sBJpql5fOS0`
        );
        return response;
    } catch (error) {
        return error.response;
    }
};
