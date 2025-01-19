import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

const ProtectedRoute = ({
  children,
  allowedRoles,
  unauthorizedRedirect = "/unauthorized",
  loginRedirect = "/kycu",
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null); // Track user role
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          navigate(loginRedirect); // Redirect unauthenticated users
          return;
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          setUserRole(role); // Set the role
          if (allowedRoles.includes(role)) {
            setIsAuthorized(true);
          } else {
            navigate(unauthorizedRedirect); // Redirect unauthorized users
          }
        } else {
          navigate(loginRedirect); // Redirect if user document doesn't exist
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate(loginRedirect); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [navigate, allowedRoles, unauthorizedRedirect, loginRedirect]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Pass userRole as prop to children
  return isAuthorized ? React.cloneElement(children, { userRole }) : null;
};

export default ProtectedRoute;
