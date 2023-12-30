'use client'

import PropTypes from 'prop-types';
// form
import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------

// FormProvider.propTypes = {
//   children: PropTypes.node,
//   methods: PropTypes.object,
//   onSubmit: PropTypes.func,
// };

 const FormProvider=({ children, onSubmit, methods })=> {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
export default FormProvider;