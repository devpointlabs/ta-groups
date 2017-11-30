import React from 'react';
import axios from 'axios';
import { 
  Form, 
  Header,
  Image,
  Divider,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setActiveModule, setActiveStudent } from '../actions/active';
import { setHeaders } from '../actions/headers';
import { setFlash } from '../actions/flash';

class Notes extends React.Component {
  state = {
    activeModule: {},
    activeStudent: {},
    activeNote: { content: '' },
    notes: [],
    modules: [], 
    students: [],
  }

  componentWillReceiveProps(nextProps) {
    const course = this.props.course || {}
    const { activeModule, activeStudent } = this.props;
    if (nextProps.course.id !== course.id) {
      const modules = this.compileModules(nextProps.course);
      const students = this.compileStudents(nextProps.course);
      this.setState({ students, modules });
    }

    if (nextProps.activeModule.id && nextProps.activeStudent.id) {
      if (activeModule.id !== nextProps.activeModule.id || activeStudent.id !== nextProps.activeStudent.id) 
        this.getNotes(nextProps.activeStudent, nextProps.activeModule)
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

  getNotes = (activeStudent, activeModule) => {
    this.setState({ activeNote: { content: '' }}, () => {
      axios.get(`/api/notes?student_id=${activeStudent.id}&module_id=${activeModule.id}`)
        .then( ({ data, headers }) => {
          this.props.dispatch(setHeaders(headers))
          this.setState({ activeNote: data });
        })
    });
  }

  optionChange = (type, value, data) => {
    const action = type === 'activeStudent' ? setActiveStudent : setActiveModule; 
    const obj = data.find( o => o.id === value );
    this.props.dispatch(action(obj, this.getNotes))
  }

  updateNote = (e) => {
    e.preventDefault();
    const { activeNote } = this.state;
    const { dispatch } = this.props;
    axios.put(`/api/notes/${activeNote.id}`, { note: { content: activeNote.content }})
      .then( ({ headers }) => {
        dispatch(setHeaders(headers));
        dispatch(setFlash('Note Saved', 'success'));
      })
  }

  render() {
    const { modules, students, activeNote } = this.state;
    const { activeStudent, activeModule } = this.props;
    return (
      <Form onSubmit={ this.updateNote }>
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
        { activeNote.id &&
          <div>
            <Divider />
            <Form.TextArea 
              value={activeNote.content} 
              onChange={ (e) => this.setState({ activeNote: {...activeNote, content: e.target.value } }) }
            />
            <Form.Button>Save</Form.Button>
          </div>
        }
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return { activeModule: state.activeModule, activeStudent: state.activeStudent }
}

export default connect(mapStateToProps)(Notes);
