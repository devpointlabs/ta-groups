import React from 'react';
import Notes from './Notes';
import axios from 'axios';
import {
  Form,
  Divider,
  List,
  Checkbox,
  Accordion,
  Icon,
  Header,
  Segment, 
  Grid, 
  Button,
  Image,
  Card,
  Sticky,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setFlash } from '../actions/flash';
import { Redirect } from 'react-router-dom';
import { setActiveModule, setActiveStudent } from '../actions/active';

class Courses extends React.Component {
  state = {
    courseId: '',
    courses: [],
    accordion: { active: null, index: null },
    activeCourse: null,
    loginRedirect: false,
    view: null,
  }

  componentDidMount() {
    const { dispatch, setLoading, user } = this.props;
    setLoading(true);

    if(!user.id) {
      setLoading();
      dispatch(setFlash('You Need To Login!', 'red'));
      this.setState({ loginRedirect: true });
    } else {
      axios.get('/api/courses.json')
        .then( res => {
          let view = this.setView();
          this.setState({ courses: res.data, view }, () => {
            const courses = this.state.courses;

            if(courses.length)
              this.setState({ activeCourse: courses[0], accordion: { active: true, index: 0 }})
          });
        })
        .catch( res => {
          dispatch(setFlash('Error Loading Courses. Try Again.', 'red'));
        })
        .then( () => {
          setLoading();
      });
    }
  }

  setView = () => {
    const { user: { role }} = this.props;
    switch(role) {
      case 'user':
        return 'journal';
      case 'ta':
        return 'notes';
      case 'admin':
        return 'full';
      default:
        return null;
    }
  }

  addCourse = (e) => {
    e.preventDefault();
    const { courses, courseId } = this.state;
    let { accordion, activeCourse } = this.state;
    const { setLoading } = this.props;
    setLoading(true);

    axios.post(`/api/courses?course_id=${courseId}`)
      .then( res => {
        if (!courses.length) {
          activeCourse = res.data
          accordion = { active: true, index: 0 }
        }
          
        this.setState({ courses: [...courses, res.data], courseId: '', activeCourse, accordion });
      })
      .catch( res => {
        this.props.dispatch(setFlash('Error Adding Course. Try Again', 'red'));
      })
      .then( () => {
        setLoading();
    });
  }

  handleClick = (activeCourse, accordion) => {
    if(!accordion.active === false)
      activeCourse = null

    this.setState({ activeCourse, accordion: {...accordion, active: !accordion.active} });
  }

  handleCheck = (courseId, moduleId, data) => {
    axios.put(`/api/courses/${courseId}/modules/${moduleId}`, { module: { active: data.checked } })
      .then(res => {
        const courses = this.state.courses.map(course => {
          if(course.id === res.data.id)
            return res.data
          else
            return course
        })
        let activeCourse = this.state.activeCourse.id === res.data.id ? res.data : {}
        this.setState({ courses, activeCourse  });
      })
      .catch( error => {
        this.props.dispatch(setFlash('Error Updating Module. Try Again.', 'red'));
    });
  }

  displayModules = (course) => {
    const { user: { role } } = this.props;
    let modules = course.modules;
    modules = role === 'admin' ? modules : modules.filter(m => m.active)

    return modules.map(module => {
      return(
        <List.Item key={module.id}>
          {role === 'admin' &&
            <List.Content floated='right'>
             <Checkbox onChange={(e, data) => this.handleCheck(course.id, module.id, data) } checked={module.active} />
            </List.Content>
          }
          <List.Content>
            {module.name}
          </List.Content>
        </List.Item>
      );
    });
  }

  displayCourses = () => {
    const { accordion: { active, index }, courses } = this.state;
    if(courses.length)
      return courses.map( (course, i) => {
        return(
          [
            <Accordion.Title key={course.id} active={active} index={i} onClick={(e, data) => this.handleClick(course, data)}>
              <Icon name='dropdown' />
              { course.name }
            </Accordion.Title>,
            <Accordion.Content key={i} active={(i === index && active)}>
              <List divided verticalAlign='middle'>
                { this.displayModules(course) }
              </List>
            </Accordion.Content>
          ]
       );
      });
    else
      return(<Header as='h1' textAlign='center'>No Courses. Please Add One!</Header>)
  }

  addCourseForm = () => {
    if(this.props.user.role === 'admin')
      return(
        <Segment basic>
          <Header as='h3'>Add A Course</Header>
          <Form onSubmit={this.addCourse}>
            <Form.Input
               type="number"
               placeholder="Canvas Course ID"
               value={this.state.courseId}
               onChange={ (e) => this.setState({ courseId: e.target.value }) }
             />
            <Form.Button primary>Add Course</Form.Button>
          </Form>
        </Segment>
      )
  }

  removeCourse = (id) => {
    //eslint-disable-next-line
    if(confirm('Really Remove The Course?')) {
      const { setLoading, dispatch } = this.props;
      setLoading(true);

      axios.delete(`/api/courses/${id}`)
        .then(res => {
          const courses = this.state.courses.filter( course => ( course.id !== id))
          this.setState({ courses, activeCourse: null });
        })
        .catch(res => {
          dispatch(setFlash('Error Deleting Course. Try Again.', 'red'));
        })
        .then( () => {
          setLoading();
      });
    }
  }

  visibleGroups = (groups) => {
    const { user = {} } = this.props;
    switch(user.role) {
      case 'admin':
        return groups;
      case 'ta':
        return groups.filter( g => g.ta.user_id === user.id)
      case 'user':
        return groups.filter( g => g.students.find( s => s.user_id === user.id ) )
      default:
        return []
    }
  }

  setActive = (module, student) => {
    const { dispatch, user = {} } = this.props;
    if (user.role !== 'user') {
      dispatch(setActiveModule(module));
      dispatch(setActiveStudent(student));
    }
  }

  displayGroups = () => {
    const { user: {} } = this.props;
    return this.state.activeCourse.modules.filter( m => m.active ).map(mod => {
      const groups = this.visibleGroups(mod.groups)
      return(
        <Segment key={mod.id}>
          <Header as="h3">{mod.name}</Header>
          { groups.map( group => {
              const ta = group.ta || {}
              return (
                <div key={group.id}>
                  <Header as="h5">{ta.name}</Header>
                  <Card.Group itemsPerRow={5}>
                    { group.students.map( student =>
                        <Card onClick={() => this.setActive(mod, student)} key={student.id}>
                          <Image src={student.avatar} size="big" />
                          <Card.Content>
                            <Card.Header>
                              { student.name }
                            </Card.Header>
                          </Card.Content>
                        </Card>
                      )
                    }
                  </Card.Group>
                </div>
              )
            })
          }
        </Segment>
      )
    })
  }

  generateGroups = (id) => {
    const { setLoading, dispatch } = this.props;

    //eslint-disable-next-line
    if(confirm('Generate Groups? This Will Override Any Groups Created Already.')) {
      setLoading(true);

      axios.put(`/api/courses/${id}/generate_groups`)
        .then(res => {
          const courses = this.state.courses.map(course => {
            if(course.id === res.data.id)
              return res.data
            else
              return course
          })
          this.setState({ courses, activeCourse: res.data });
        })
        .catch( res => {
          dispatch(setFlash('Error Generating Groups. Try Again.', 'red'));
        })
        .then( () => {
          setLoading();
      });
    }
  }

  courseDisplay = () => {
    const { activeCourse } = this.state;

    if(activeCourse)
      return(
        <Segment basic>
          <Header as='h1' textAlign='center'>
            {activeCourse.name}
          </Header>
          {this.props.user.role === 'admin' &&
            <Segment basic textAlign='center'>
              <Button primary onClick={() => this.generateGroups(activeCourse.id)}>Generate Groups</Button>
              <Button color='red' onClick={() => this.removeCourse(activeCourse.id)}>Remove Course</Button>
            </Segment>
          }
          <Divider />
          { this.displayGroups() }
        </Segment>
      )
    else
      return(<Header as='h1' textAlign='center'>No Course Selected</Header>)
  }

  displaySideCol = () => {
    const { view, activeCourse } = this.state;
    switch(view) {
      case 'full':
        return this.displayCourses() 
      case 'notes':
        return <Notes course={activeCourse} />
    }
  }

  render() {
    const { user = {} } = this.props
    if(this.state.loginRedirect)
      return(<Redirect to='/login' />)
    else {
      return (
        <Segment basic>
          { this.addCourseForm() }
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Segment style={styles.column}>
                  { this.displaySideCol() }
                </Segment>
              </Grid.Column>
              <Grid.Column width={8}>
                { this.courseDisplay() }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )
    }
  }
}

const styles = {
  column: {
    height: '70vh',
    overflowY: 'scroll',
    overflowX: 'none',
  },
  fullHeight: {
    height: '100vh',
  },
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Courses);
