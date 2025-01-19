import { getAuth } from "firebase/auth";

const AdminDashboardWrapper = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return <p>Please log in to access the admin dashboard.</p>;
  }

  return <AdminDashboard currentUser={currentUser} />;
};

export default AdminDashboardWrapper;
