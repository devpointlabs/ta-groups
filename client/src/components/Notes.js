import React from 'react';
import axios from 'axios';
import { 
  Form, 
  Header,
  Image,
} from 'semantic-ui-react';

class Notes extends React.Component {
  state = {
    activeModule: {},
    activeStudent: {},
    activeNote: null,
    notes: [],
    modules: [], 
    students: [],
  }

  componentWillReceiveProps(nextProps) {
    const course = this.props || {}
    if (nextProps.course.id !== course.id) {
      const modules = this.compileModules(nextProps.course);
      const students = this.compileStudents(nextProps.course);
      this.setState({ students, modules });
    }
  }

  compileStudents = (course) => {
    let students = []
    course.modules[0].groups.forEach( group => {
      students = [...students, ...group.students]
    });
    
    return students;
  }

  compileModules = (course) => {
    return course.modules.map( mod => {
      return { id: mod.id, name: mod.name }
    });
  }

  modOptions = () => {
    return this.state.modules.map( mod => {
      return { key: mod.id, value: mod.id, text: mod.name }
    });
  }

  studentOptions = () => {
    return this.state.students.map( student => {
      return { key: student.id, value: student.id, text: student.name }
    });
  }

  optionChange = (type, value, data) => {
    this.setState({ [type]: data.find( m => m.id === value ) }, () => {
      const { activeModule, activeStudent } = this.state;
      if (activeModule.id && activeStudent.id) {
        //TODO make call to get or create note
      }
    });
  }

  render() {
    const { activeStudent, activeModule, modules, students } = this.state;
    return (
      <Form>
        <Form.Select 
          label="Module" 
          options={this.modOptions()} 
          onChange={ (_, { value }) => this.optionChange('activeModule', value, modules) }
        />
        <Form.Select 
          label="Student" 
          options={this.studentOptions()} 
          onChange={ (_, { value }) => this.optionChange('activeStudent', value, students) }
        />
        { (!activeStudent.id || !activeModule.id) && 
            <Header as="h3" textAlign="center">Select a student & module to view notes</Header>
        }
        <Header as="h2">{activeModule.name}</Header>
        <Header as="h3">{activeStudent.name}</Header>
        <Image src={activeStudent.avatar} avatar size="small" />
      </Form>
    )
  }
}

export default Notes;
