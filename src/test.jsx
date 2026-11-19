import api from "./services/api";

function TestAPI() {

    const testAPI = async () => {
        try {
            const response = await api.get("/students");

            console.log(response.data);

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h1>API Testing</h1>

            <button onClick={testAPI}>
                Test API
            </button>
        </div>
    );
}

export default TestAPI;