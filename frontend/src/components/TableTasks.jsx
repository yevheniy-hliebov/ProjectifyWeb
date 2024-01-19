import React from 'react';
import { formatDate } from '../modules/format-date';
import { Link } from 'react-router-dom';
import Button from './form-components/Button';

function TableTasks({ projectSlug, tasks, handleDeleteTask = () => {} }) {
  return (
    <div className="w-full p-[15px]">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="border border-gray-500">Name</th>
            <th className="border border-gray-500">Description</th>
            <th className="border border-gray-500">Status</th>
            <th className="border border-gray-500">Priority</th>
            <th className="border border-gray-500">Start date</th>
            <th className="border border-gray-500">End date</th>
            <th className="border border-gray-500">Created</th>
            <th className="border border-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => {
            return (
              <tr key={index}>
                <td className="border border-gray-500">
                  <Link
                    to={`/projects/${projectSlug}/tasks/${task.number}`}
                    className="hover:text-blue-600 active:hover:text-blue-700"
                  >
                    {task.name}
                  </Link>
                </td>
                <td className="border border-gray-500">{task.description}</td>
                <td className="border border-gray-500 text-center">{task.status}</td>
                <td className="border border-gray-500 text-center">{task.priority}</td>
                <td className="border border-gray-500 text-center">{task.start_date}</td>
                <td className="border border-gray-500 text-center">{task.end_date}</td>
                <td className="border border-gray-500 text-center">
                  {formatDate(task.createdAt, 'yyyy-MM-dd (HH:mm)')}
                </td>
                <td className="border border-gray-500 text-center">
                  <div className="flex justify-center items-center gap-[10px]">
                    <Button
                      link={`/projects/${projectSlug}/tasks/${task.number}/edit`}
                      color="gray"
                    >
                      Edit
                    </Button>
                    <Button
                      color="red"
                      onClick={() => {
                        handleDeleteTask(task, index);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableTasks;
