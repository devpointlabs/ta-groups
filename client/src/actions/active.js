export const setActiveModule = (module) => {
  return { type: 'SET_ACTIVE_MODULE', module }
}

export const setActiveStudent = (student) => {
  return { type: 'SET_ACTIVE_STUDENT', student }
}

export const clearActiveModule = () => {
  return { type: 'CLEAR_ACTIVE_MODULE' }
}

export const clearActiveStudent = () => {
  return { type: 'CLEAR_ACTIVE_STUDENT' }
}
