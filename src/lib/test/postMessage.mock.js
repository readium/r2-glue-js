const addEventListener_ = window.addEventListener;

window.addEventListener = jest.fn().mockImplementation((type, listener, options) => {
  return {
    type,
    listener,
    options
  }
});
