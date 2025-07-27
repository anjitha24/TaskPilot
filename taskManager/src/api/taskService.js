export const getUserTasks = async (username) => {
  return [
    {
      _id: "1",
      title: "Design Homepage",
      description: "Create homepage layout",
      dueDate: new Date().toISOString(),
      status: "In Progress"
    },
    {
      _id: "2",
      title: "Setup API",
      description: "Integrate backend APIs",
      dueDate: new Date().toISOString(),
      status: "Done"
    }
  ];
};

export const updateTaskStatus = async (taskId, newStatus) => {
  console.log(`Updating task ${taskId} to status: ${newStatus}`);
  return { success: true };
};
