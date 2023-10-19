import React, { useState } from 'react';
import Education from './components/Education';

function DynamicFormComponent() {
  const [formFields, setFormFields] = useState([]);

  const handleAddFields = () => {
    setFormFields([...formFields, <Education key={formFields.length} />]);
  };

  const handleRemoveFields = (index) => {
    if (formFields.length === 1) {
      alert('At least one form must remain');
      return;
    }
    const values = [...formFields];
    values.splice(index, 1);
    setFormFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('formFields:', formFields);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2%' }}>
      {formFields.map((field, index) => (
        <div key={index} style={{ marginBottom: 5 }}>
          {field}
          <button type="button" onClick={() => handleRemoveFields(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddFields} style={{ marginTop: 10, marginRight: 10 }}>
        Add Education
      </button>

      <button type="submit">Submit</button>
    </form>
  );
}

export default DynamicFormComponent;
