import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from "./components/Home compenents/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import GroupList from "./components/Groups/GroupList";
import GroupDetail from "./components/Groups/GroupDetail";
import PostDetail from "./pages/PostDetail";
import CourseForm from "./components/Course/CourseForm";
import CourseDetail from "./components/Course/CourseDetail";
import Home from "./pages/Home";
import AddCourse from "./components/Course/AddCourse";
import ContentDashboard from "./components/Course/ContentDashboard";
import Profile from "./pages/Profile";
import Enrollments from "./pages/Enrollments";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:postId/edit" element={<EditPost />} />
            <Route path="/groups" element={<GroupList />} />
            <Route path="/groups/:groupId" element={<GroupDetail />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/courses/:id" element={<CourseForm />} />
            <Route path="/course/:id/:userid" element={<CourseDetail />} />
            <Route path="/home" element={<Home />} />
            <Route path="/addcourse/:id" element={<AddCourse />} />
            <Route path="/ContentDashboard/:id" element={<ContentDashboard />} />
            <Route path ="/profile/:userid" element={<Profile />} />
            <Route path ="/enrollments/:courseId/:userId" element={<Enrollments />} />
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
