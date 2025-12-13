import { useEffect, useMemo, useState } from "react";
import styles from "./UserManagement.module.css";
import IUser from "../../interfaces/IUser";
import axios from "axios";
import { useUserStore } from "../../store";

const UserManagement = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/user/get-all`);
        setUsers(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backend]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.put(`${backend}/user/change-role/${userId}`, {
        role: newRole,
        superId: user?._id,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;

    return users.filter(
      (u) =>
        u.fullname?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u._id.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>User Management</h1>

      <input
        type="text"
        placeholder="Search by name, email or ID..."
        className={styles.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.fullname}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    className={styles.roleSelect}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="super">Super</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default UserManagement;
