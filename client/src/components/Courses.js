import React from 'react';
import axios from 'axios';
import { Form } from 'semantic-ui-react';

class Courses extends React.Component {
  state = { courseId: '', courses: [] }

  componentDidMount() {
    axios.get('/api/courses.json')
      .then( res => this.setState({ courses: res.data }) )
  }

  addCourse = (e) => {
    e.preventDefault(); 
    const { courses, courseId } = this.state;
    axios.post(`/api/courses?course_id=${this.state.courseId}`)
      .then( res => this.setState({ courses: [...courses, res.data], courseId: '' }) )
  }

  render() {
    const { courseId } = this.state;
    return (
      <Form onSubmit={this.addCourse}>
        <Form.Input 
           type="number" 
           placeholder="course_id" 
           value={courseId}
           onChange={ (e) => this.setState({ courseId: e.target.value }) }
         />
        <Form.Button>+Add Course</Form.Button>
      </Form>
    )
  }
}

export default Courses;
