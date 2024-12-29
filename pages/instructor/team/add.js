import React from "react";
import InstructorForm from "src/components/InstructorForm";
import InstructorPageLayout from "src/components/InstructorPageLayout";

const AddInstructor = () => {
  return (
    <InstructorPageLayout>
      <InstructorForm />
    </InstructorPageLayout>
  );
};

// Add getStaticProps
export async function getStaticProps() {
  return {
    props: {}, // Will be passed to the page component as props
  };
}

export default AddInstructor;
