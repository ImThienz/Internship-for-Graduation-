import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
// import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUser(id);
        toast.success("Đã xóa người dùng thành công");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const cancelEdit = () => {
    setEditableUserId(null);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      toast.success("Cập nhật thông tin thành công");
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Quản lý người dùng
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Nếu muốn thêm AdminMenu vào đây */}
            {/* <div className="w-full md:w-1/5 mb-6 md:mb-0 md:mr-6">
              <AdminMenu />
            </div> */}

            <div className="w-full">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader />
                </div>
              ) : error ? (
                <Message variant="danger">
                  {error?.data?.message || error.error}
                </Message>
              ) : (
                <div className="overflow-x-auto">
                  {filteredUsers?.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      Không tìm thấy người dùng phù hợp
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Tên người dùng
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Quyền admin
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers?.map((user) => (
                          <tr
                            key={user._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user._id}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              {editableUserId === user._id ? (
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={editableUserName}
                                    onChange={(e) =>
                                      setEditableUserName(e.target.value)
                                    }
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              ) : (
                                <div className="text-sm font-medium text-gray-900">
                                  {user.username}
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              {editableUserId === user._id ? (
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={editableUserEmail}
                                    onChange={(e) =>
                                      setEditableUserEmail(e.target.value)
                                    }
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">
                                  <a
                                    href={`mailto:${user.email}`}
                                    className="hover:text-blue-600 transition-colors"
                                  >
                                    {user.email}
                                  </a>
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.isAdmin ? (
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Admin
                                </span>
                              ) : (
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Người dùng
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {editableUserId === user._id ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => updateHandler(user._id)}
                                    className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg p-2 transition-colors"
                                    title="Lưu thay đổi"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="text-white bg-gray-600 hover:bg-gray-700 rounded-lg p-2 transition-colors"
                                    title="Hủy"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      toggleEdit(
                                        user._id,
                                        user.username,
                                        user.email
                                      )
                                    }
                                    className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg p-2 transition-colors"
                                    title="Chỉnh sửa"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                  </button>
                                  {!user.isAdmin && (
                                    <button
                                      onClick={() => deleteHandler(user._id)}
                                      className="text-white bg-red-600 hover:bg-red-700 rounded-lg p-2 transition-colors"
                                      title="Xóa người dùng"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
