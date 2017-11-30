const activeStudent = (state = {}, action) => {
  switch(action.type) {
    case 'SET_ACTIVE_STUDENT':
      return action.student;
    case 'CLEAR_ACTIVE_STUDENT':
      return {};
    default:
      return state;
  }
}

export default activeStudent;
