import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import { AddTaskForm } from "./components/form/AddTaskForm";

import { TaskList } from "./components/task-lists/TaskList";
import { NotToDoList } from "./components/task-lists/NotToDoList";
import {
	createTask,
	getTaskLists,
	switchTask,
	deleteTasks,
} from "./apis/taskApi";

import "./App.css";

const HRPW = 168;
const initialResponse = {
	status: "",
	message: "",
};

const App = () => {
	const [tasks, setTasks] = useState([]);

	const [error, setError] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState([]);

	const [apiResponse, setApiResponse] = useState(initialResponse);

	const totalHrs = tasks.reduce((subttl, itm) => subttl + +itm.hr, 0);

	useEffect(() => {
		// fetch all the ticket and set in the task[]
		const fetchingAllTask = async () => {
			const { result } = await getTaskLists();
			setTasks(result);
		};

		fetchingAllTask();
	}, []);

	const fetchAllTasks = async () => {
		const { result } = await getTaskLists();
		setTasks(result);
	};

	const addTaskList = async frmDt => {
		if (totalHrs + +frmDt.hr > HRPW) {
			setApiResponse({
				status: "error",
				message: "Not enough hours left to allocate this task",
			});
			return;
		}
		const result = await createTask(frmDt);

		if (result._id) {
			//new task has been added success fully, now we can call api to fetch all the data
			fetchAllTasks();
			setApiResponse({
				status: "success",
				message: "New task has been added successfully",
			});

			return;
		}

		setApiResponse({
			status: "error",
			message: "unable to add the task at the moment, please try again later",
		});
	};

	const markAsBadList = async _id => {
		console.log(_id);
		const dt = {
			id: _id,
			todo: false,
		};

		const res = await switchTask(dt);
		res.result._id && fetchAllTasks();
	};

	const markAsGoodList = async _id => {
		const dt = {
			id: _id,
			todo: true,
		};

		const res = await switchTask(dt);
		res.result._id && fetchAllTasks();
	};

	// collect indices of the task list that to be deleted
	const handleOnTaskClicked = e => {
		const { checked, value } = e.target;
		if (checked) {
			setTaskToDelete([...taskToDelete, value]);
		} else {
			const filteredArg = taskToDelete.filter(itme => itme !== value);
			setTaskToDelete(filteredArg);
		}
	};

	//delete list form task list and bad list
	const handleOnDeleteItems = async () => {
		//request server to delete items form database

		const { deletedCount } = await deleteTasks({ ids: taskToDelete });

		deletedCount > 0 &&
			fetchAllTasks() &&
			setApiResponse({
				status: "success",
				message: "Selected tasks has been deleted successfully",
			});
	};

	//task list only
	const taskListsOnly = tasks.filter(item => item.todo);
	//bad list only
	const badTaskListsOnly = tasks.filter(item => !item.todo);

	return (
		<div className="main">
			<Container>
				<Row>
					<Col>
						<h1 className="text-center mt-5">Not To Do Task List</h1>
					</Col>
				</Row>
				<hr />
				<Row>
					<Col>
						{apiResponse.message && (
							<Alert
								variant={
									apiResponse.status === "success" ? "success" : "danger"
								}
							>
								{apiResponse.message}
							</Alert>
						)}
					</Col>
				</Row>
				<AddTaskForm addTaskList={addTaskList} />
				<hr />
				<Row>
					<Col>
						{!tasks.length && <Spinner animation="border" variant="primary" />}
						<TaskList
							// tasks={tasks}
							tasks={taskListsOnly}
							markAsBadList={markAsBadList}
							handleOnTaskClicked={handleOnTaskClicked}
							taskToDelete={taskToDelete}
						/>
					</Col>
					<Col>
						<NotToDoList
							// badTasks={badTasks}
							badTasks={badTaskListsOnly}
							markAsGoodList={markAsGoodList}
							handleOnBadTaskClicked={handleOnTaskClicked}
							badTaskToDelete={taskToDelete}
						/>
					</Col>
				</Row>
				<Row className="py-3">
					<Col>
						<Button variant="danger" onClick={handleOnDeleteItems}>
							Delete
						</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<Alert variant="info">
							Your total allocated hours = {totalHrs} / 168 hours per week
						</Alert>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default App;
