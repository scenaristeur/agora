import {
  ADD_TODO,
  UPDATE_FILTER,
  UPDATE_TODO_STATUS,
  CLEAR_COMPLETED
} from './actions.js';

export const VisibilityFilters = {
  SHOW_ALL: 'All',
  SHOW_ACTIVE: 'Active',
  SHOW_COMPLETED: 'Completed'
};

const INITIAL_STATE = {
  todos: [],
  filter: VisibilityFilters.SHOW_ALL
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
    case ADD_TODO:
  return {
    ...state,
    todos: [...state.todos, action.todo]
  };
case UPDATE_TODO_STATUS:
  return {
    ...state,
    todos: state.todos.map(todo =>
      todo.id === action.todo.id


        ? { ...action.todo, complete: action.complete }
        : todo
    )
  };
case UPDATE_FILTER:
  return {
    ...state,
    filter: action.filter
  };
case CLEAR_COMPLETED:
  return {
    ...state,
    todos: state.todos.filter(todo => !todo.complete)
  };
      return state;
  }
};
