import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createClass } from '../services/api';

export default function ScheduleClassPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course: '',
    title: '',
    scheduledTime: '',
    duration: '',
    meetingLink: ''
  });

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    console.error('Invalid user in localStorage');
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('FETCH COURSES ERROR:', error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user || !user.id) {
        alert('Teacher not logged in properly');
        return;
      }

      await createClass({
        ...form,
        teacher: user.id
      });

      alert('Class scheduled successfully');

      setForm({
        course: '',
        title: '',
        scheduledTime: '',
        duration: '',
        meetingLink: ''
      });
    } catch (error) {
      console.error('CREATE CLASS ERROR:', error);
      alert(error.response?.data?.message || 'Failed to schedule class');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Schedule Class</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Course</label>
          <br />
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Class Title</label>
          <br />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Scheduled Time</label>
          <br />
          <input
            type="datetime-local"
            name="scheduledTime"
            value={form.scheduledTime}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Duration (minutes)</label>
          <br />
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Meeting Link</label>
          <br />
          <input
            type="url"
            name="meetingLink"
            value={form.meetingLink}
            onChange={handleChange}
            placeholder="https://meet.jit.si/RemoteClassroomTest1"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit">Schedule Class</button>
      </form>
    </div>
  );
}