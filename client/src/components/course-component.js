import React from "react";
import { useNavigate } from "react-router-dom";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能看到課程</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            返回登入畫面
          </button>
        </div>
      )}

      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>歡迎進入學生課程頁面</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>歡迎進入教師課程頁面</h1>
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
