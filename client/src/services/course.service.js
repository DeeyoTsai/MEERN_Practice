import axios from "axios";

const API_URL = "http://localhost:8080/api/course";

class CourseService {
  post(title, description, price) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      { title, description, price },
      { headers: { Authorization: token } }
    );
  }
  //�ϥ�student id�A���ǥ͵��U���ҵ{
  getEnrolledCourses(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/student/" + _id, {
      headers: { Authorization: token },
    });
  }
  //�ǥͥνҵ{�W�ٷj�M�ҵ{
  getCourseByName(name) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/findByName/" + name, {
      headers: { Authorization: token },
    });
  }
  //�ǥͥνҵ{id���U�ҵ{
  enrollCourse(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      { headers: { Authorization: token } }
    );
  }

  //�ϥ�instructor id�A�ӧ�����v�֦����ҵ{
  get(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/instructor/" + _id, {
      headers: { Authorization: token },
    });
  }
}

export default new CourseService();
