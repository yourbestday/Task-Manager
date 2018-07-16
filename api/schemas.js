const yup = require('yup');

module.exports = {
  NewProject: yup.object().shape({
    name: yup.string().required('is required'),
    dueto: yup.date(),
    tasks: yup.array().of(yup.object().shape())
  }),
  NewTask: yup.object().shape({
    name: yup.string(),
    assignto: yup.object().shape({
        name: yup.string(),
        email: yup.string()
    }),
    dueto: yup.date(),
    priority: yup.string(),
    status: yup.string()
  }),
  ExistingProject: yup.object().shape({
    name: yup.string(),
    // owner: yup.object().shape({
    //   name: yup.string('name must not be empty'),
    //   email: yup.string().email()
    // }),
    dueto: yup.date(),
    tasks: yup.array().of(yup.object().shape({
      name: yup.string(),
      assignto: yup.object().shape({
          name: yup.string(),
          email: yup.string()
      }),
      dueto: yup.date(),
      priority: yup.string(),
      status: yup.string()
    }))
  })
};
