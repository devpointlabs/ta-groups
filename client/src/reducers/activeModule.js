const activeModule = (state = {}, action) => {
  switch(action.type) {
    case 'SET_ACTIVE_MODULE':
      return action.module;
    case 'CLEAR_ACTIVE_MODULE':
      return {};
    default:
      return state;
  }
}

export default activeModule;
