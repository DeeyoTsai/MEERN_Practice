import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import CourseComponent from "./components/course-component";
import authService from "./services/auth.service";

function App() {
  let [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route index element={<HomeComponent />} />
          <Route path="register" element={<RegisterComponent />}></Route>
          <Route
            path="login"
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="profile"
            element={
              <ProfileComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="course"
            element={
              <CourseComponent
                currentUser={currentUser}
                getCurrentUser={setCurrentUser}
              />
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
