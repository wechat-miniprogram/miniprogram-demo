const TComponent = (options) => {
  options.options = {multipleSlots: true, addGlobalClass: true, ...options.options}
  return Component(options)
}
export default TComponent
