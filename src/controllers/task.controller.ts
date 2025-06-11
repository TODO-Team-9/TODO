import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { HTTP_Status } from "../enums/HTTP_Status";

const taskService = new TaskService();

export const createTask = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { taskName, taskDescription, teamId, memberId, priorityId } = request.body;
    if (!taskName || !teamId || !priorityId) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "taskName, teamId, and priorityId are required" });
      return;
    }
    const task = await taskService.createTask(
      taskName,
      taskDescription ?? null,
      teamId,
      priorityId,
      memberId
    );
    response.status(HTTP_Status.CREATED).json(task);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const assignTask = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { taskId } = request.params;
    const { memberId, username } = request.body;
    if (memberId === undefined && !username) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "memberId or username is required" });
      return;
    }
    await taskService.assignTask(
      Number(taskId),
      memberId !== undefined ? Number(memberId) : undefined,
      username
    );
    response
      .status(HTTP_Status.OK)
      .json({ message: "Task assigned successfully" });
  } catch (error: any) {
    if (
      error.message &&
      (error.message.includes("does not exist") ||
        error.message.includes("does not exist in that team"))
    ) {
      response.status(HTTP_Status.NOT_FOUND).json({ error: error.message });
    } else {
      response
        .status(HTTP_Status.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export const changeTaskStatus = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { taskId } = request.params;
    const { statusId } = request.body;
    if (!statusId) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "statusId is required" });
      return;
    }
    await taskService.changeTaskStatus(Number(taskId), Number(statusId));
    response
      .status(HTTP_Status.OK)
      .json({ message: "Task status updated successfully" });
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getTasksForTeam = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { teamId } = request.params;
    const tasks = await taskService.getTasksForTeam(Number(teamId));
    response.status(HTTP_Status.OK).json(tasks);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getTasksForUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { userId } = request.params;
    const tasks = await taskService.getTasksForUser(Number(userId));
    response.status(HTTP_Status.OK).json(tasks);
  } catch (error: any) {
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const deleteTask = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { taskId } = request.params;
    await taskService.deleteTask(Number(taskId));
    response.status(HTTP_Status.NO_CONTENT).send();
  } catch (error: any) {
    if (error.message && error.message.includes("Task does not exist")) {
      response.status(HTTP_Status.NOT_FOUND).json({ error: "Task not found" });
    } else {
      response
        .status(HTTP_Status.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};
