import axios from "axios";

const rootUrl = "http://localhost:8000/";
const taskApi = rootUrl + "api/v1/";

// post data
export const createTask = frmDt => {
	return new Promise((resolve, reject) => {
		axios
			.post(taskApi, frmDt)
			.then(response => {
				resolve(response.data);
			})
			.catch(error => {
				console.log(error);
				resolve(false);
			});
	});
};

// fetch all tasks
export const getTaskLists = () => {
	return new Promise(async resolve => {
		try {
			const result = await axios.get(taskApi);
			resolve(result.data);
		} catch (error) {
			console.log(error);
			resolve(false);
		}
	});
};

//switch task  between to do and not to do list
export const switchTask = taskInfo => {
	return new Promise(async resolve => {
		try {
			const { data } = await axios.patch(taskApi, taskInfo);
			resolve(data);
		} catch (error) {
			console.log(error);
			resolve(false);
		}
	});
};

//delete tasks for dbs
export const deleteTasks = ids => {
	return new Promise(async resolve => {
		try {
			const { data } = await axios.delete(taskApi, { data: ids });
			resolve(data);
		} catch (error) {
			console.log(error);
			resolve(false);
		}
	});
};
