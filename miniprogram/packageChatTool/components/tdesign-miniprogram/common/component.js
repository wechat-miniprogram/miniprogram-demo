const TComponent = (options) => {
    options.options = Object.assign({ multipleSlots: true, addGlobalClass: true }, options.options);
    return Component(options);
};
export default TComponent;
